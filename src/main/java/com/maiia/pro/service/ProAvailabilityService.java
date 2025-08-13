package com.maiia.pro.service;

import com.maiia.pro.entity.Appointment;
import com.maiia.pro.entity.Availability;
import com.maiia.pro.entity.TimeSlot;
import com.maiia.pro.repository.AppointmentRepository;
import com.maiia.pro.repository.AvailabilityRepository;
import com.maiia.pro.repository.TimeSlotRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
import java.util.Map;
import java.util.LinkedHashMap;

/**
 * Service in charge of generating 15-min availabilities from practitioner time slots
 * while subtracting existing appointments.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ProAvailabilityService {

    /**
     * Duration of one availability slot.
     */
    private static final Duration SLOT = Duration.ofMinutes(15);

    @Autowired
    private AvailabilityRepository availabilityRepository;
    @Autowired
    private AppointmentRepository appointmentRepository;
    @Autowired
    private TimeSlotRepository timeSlotRepository;

    /**
     * True if [start1, end1) overlaps [start2, end2).
     */
    private static boolean overlaps(LocalDateTime start1, LocalDateTime end1,
                                    LocalDateTime start2, LocalDateTime end2) {
        return start1.isBefore(end2) && start2.isBefore(end1);
    }

    /**
     * Returns the currently stored availabilities for a practitioner.
     */
    @Transactional(readOnly = true)
    public List<Availability> findByPractitionerId(Integer practitionerId) {
        return availabilityRepository.findByPractitionerId(practitionerId)
                .stream()
                .sorted(Comparator.comparing(Availability::getStartDate))
                .collect(Collectors.toList());
    }

    /**
     * Regenerates availabilities for the given practitioner from time slots,
     * excluding intervals already booked by appointments.
     */
    @Transactional
    public List<Availability> generateAvailabilities(Integer practitionerId) {
        purgeExistingAvailabilities(practitionerId);

        final List<TimeSlot> timeSlots = loadSortedTimeSlots(practitionerId);
        final List<Appointment> appointments = loadSortedAppointments(practitionerId);

        // For each time slot compute free intervals
        final List<Availability> toPersist = timeSlots.stream()
                .flatMap(ts ->
                        freeIntervalsWithin(ts, appointments).stream()
                                .flatMap(iv -> splitIntoChunks(iv, ts.getEndDate()).stream())
                                .filter(iv -> appointments.stream()
                                        .noneMatch(ap -> overlaps(
                                                iv.start, iv.end,
                                                ap.getStartDate(), ap.getEndDate())
                                        ))
                )
                .map(iv -> Availability.builder()
                        .practitionerId(practitionerId)
                        .startDate(iv.start)
                        .endDate(iv.end)
                        .build())
                .collect(Collectors.toList());

        final Map<String, Availability> unique = new LinkedHashMap<>();
        toPersist.stream()
                .sorted(Comparator.comparing(Availability::getStartDate))
                .forEach(av -> {
                    final String key = av.getStartDate().toString() + '|' + av.getEndDate().toString();
                    unique.putIfAbsent(key, av);
                });

        // Persist and return in a deterministic order
        final List<Availability> saved = StreamSupport
                .stream(availabilityRepository.saveAll(unique.values()).spliterator(), false)
                .sorted(Comparator.comparing(Availability::getStartDate))
                .collect(Collectors.toList());

        if (log.isDebugEnabled()) {
            log.debug("Generated {} availabilities for practitioner {}", saved.size(), practitionerId);
        }
        return saved;
    }

    private void purgeExistingAvailabilities(Integer practitionerId) {
        final List<Availability> existing = availabilityRepository.findByPractitionerId(practitionerId);
        if (!existing.isEmpty()) {
            availabilityRepository.deleteAll(existing);
        }
    }

    private List<TimeSlot> loadSortedTimeSlots(Integer practitionerId) {
        final List<TimeSlot> timeSlots = timeSlotRepository.findByPractitionerId(practitionerId);
        timeSlots.sort(Comparator.comparing(TimeSlot::getStartDate));
        return timeSlots;
    }

    private List<Appointment> loadSortedAppointments(Integer practitionerId) {
        final List<Appointment> appointments = appointmentRepository.findByPractitionerId(practitionerId);
        appointments.sort(Comparator.comparing(Appointment::getStartDate));
        return appointments;
    }

    /**
     * Compute free intervals inside a given time slot.
     */
    private List<Interval> freeIntervalsWithin(TimeSlot ts, List<Appointment> allAppointments) {
        final List<Interval> free = new ArrayList<>();
        free.add(new Interval(ts.getStartDate(), ts.getEndDate()));

        for (Appointment ap : overlappingAppointments(ts, allAppointments)) {
            subtractInterval(free, ap.getStartDate(), ap.getEndDate());
            if (free.isEmpty()) break;
        }
        return free;
    }

    private List<Appointment> overlappingAppointments(TimeSlot ts, List<Appointment> appointments) {
        final LocalDateTime s = ts.getStartDate();
        final LocalDateTime e = ts.getEndDate();
        return appointments.stream()
                .filter(ap -> overlaps(s, e, ap.getStartDate(), ap.getEndDate()))
                .collect(Collectors.toList());
    }

    /**
     * Subtracts an interval from a list of disjoint free intervals.
     */
    private void subtractInterval(List<Interval> free, LocalDateTime start2, LocalDateTime end2) {
        final List<Interval> updated = new ArrayList<>();
        for (Interval f : free) {
            if (!overlaps(f.start, f.end, start2, end2)) {
                updated.add(f);
                continue;
            }
            // Left remainder
            final LocalDateTime leftStart = f.start;
            final LocalDateTime rightEnd = f.end;
            final LocalDateTime leftEnd =  rightEnd.isBefore(start2) ? rightEnd : start2;
            if (leftStart.isBefore(leftEnd)) {
                updated.add(new Interval(leftStart, leftEnd));
            }
            // Right remainder
            final LocalDateTime rightStart = leftStart.isAfter(end2) ? leftStart : end2;

            if (rightStart.isBefore(rightEnd)) {
                updated.add(new Interval(rightStart, rightEnd));
            }
        }
        free.clear();
        free.addAll(updated);
    }

    /**
     * Split a free interval into 15-min chunks.
     * If the last chunk would be shorter than 15 min, we only keep it when the free interval ends
     * at the end of the time slot.
     */
    private List<Interval> splitIntoChunks(Interval iv, LocalDateTime timeSlotEnd) {
        final List<Interval> chunks = new ArrayList<>();
        LocalDateTime cursor = iv.start;

        while (cursor.isBefore(iv.end)) {
            LocalDateTime next = cursor.plus(SLOT);
            if (next.isAfter(iv.end)) {
                if (!iv.end.equals(timeSlotEnd)) {
                    break; // skip intermediate short chunk
                }
                next = iv.end;
            }
            if (next.isAfter(cursor)) {
                chunks.add(new Interval(cursor, next));
            }
            cursor = cursor.plus(SLOT);
        }
        return chunks;
    }

    /**
     * Tiny value-type for time intervals.
     */
    private static final class Interval {
        final LocalDateTime start;
        final LocalDateTime end;

        Interval(LocalDateTime start, LocalDateTime end) {
            this.start = start;
            this.end = end;
        }
    }
}