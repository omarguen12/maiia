package com.maiia.pro.service;

import com.maiia.pro.EntityFactory;
import com.maiia.pro.entity.Appointment;
import com.maiia.pro.entity.Availability;
import com.maiia.pro.entity.Practitioner;
import com.maiia.pro.repository.AppointmentRepository;
import com.maiia.pro.repository.AvailabilityRepository;
import com.maiia.pro.repository.PractitionerRepository;
import com.maiia.pro.repository.TimeSlotRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.Month;
import java.util.List;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ProAppointmentServiceTest {
    private static final Integer PATIENT_ID = 424242;
    private final EntityFactory factory = new EntityFactory();
    @Autowired
    private ProAppointmentService appointmentService;

    @Autowired
    private ProAvailabilityService availabilityService;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private AvailabilityRepository availabilityRepository;

    @Autowired
    private PractitionerRepository practitionerRepository;

    @Autowired
    private TimeSlotRepository timeSlotRepository;

    private Practitioner practitioner;
    private LocalDateTime start;

    @BeforeEach
    void setup() {
        appointmentRepository.deleteAll();
        availabilityRepository.deleteAll();
        timeSlotRepository.deleteAll();
        practitionerRepository.deleteAll();

        practitioner = practitionerRepository.save(factory.createPractitioner());
        start = LocalDateTime.of(2021, Month.FEBRUARY, 8, 8, 0, 0);

        timeSlotRepository.save(factory.createTimeSlot(practitioner.getId(), start, start.plusHours(2)));     // 08:00-10:00
        timeSlotRepository.save(factory.createTimeSlot(practitioner.getId(), start.plusMinutes(30), start.plusHours(2).plusMinutes(30))); // 08:30-10:30
    }

    @Test
    @Transactional
    void createAndRegenerateAvailabilitiesWithoutDuplicates() {
        List<Availability> beforeBooking = availabilityService.generateAvailabilities(practitioner.getId());
        assertFalse(beforeBooking.isEmpty());

        Appointment appointment = appointmentService.create(
                Appointment.builder()
                        .patientId(PATIENT_ID)
                        .practitionerId(practitioner.getId())
                        .startDate(start)
                        .endDate(start.plusMinutes(15))
                        .build()
        );
        assertNotNull(appointment.getId());

        List<Availability> afterBooking = availabilityService.findByPractitionerId(practitioner.getId());

        assertTrue(afterBooking.stream().noneMatch(a -> a.getStartDate().equals(start) && a.getEndDate().equals(start.plusMinutes(15))));

        long distinct = afterBooking.stream()
                .map(a -> a.getStartDate().toString() + "|" + a.getEndDate().toString())
                .distinct()
                .count();
        assertEquals(distinct, afterBooking.size());

        assertTrue(afterBooking.stream().anyMatch(a -> a.getStartDate().equals(start.plusMinutes(15)) && a.getEndDate().equals(start.plusMinutes(30))));
    }

    @Test
    void createMultipleAppointmentsShouldRemoveAllBookedSlots() {
        availabilityService.generateAvailabilities(practitioner.getId());

        appointmentService.create(Appointment.builder()
                .patientId(PATIENT_ID)
                .practitionerId(practitioner.getId())
                .startDate(start.plusMinutes(45))   // 08:45-09:00
                .endDate(start.plusMinutes(60))
                .build());

        appointmentService.create(Appointment.builder()
                .patientId(PATIENT_ID)
                .practitionerId(practitioner.getId())
                .startDate(start.plusMinutes(90))   // 09:30-09:45
                .endDate(start.plusMinutes(105))
                .build());

        List<String> slots = availabilityService.findByPractitionerId(practitioner.getId())
                .stream().map(a -> a.getStartDate() + "->" + a.getEndDate()).collect(Collectors.toList());

        assertFalse(slots.contains(start.plusMinutes(45) + "->" + start.plusMinutes(60)));
        assertFalse(slots.contains(start.plusMinutes(90) + "->" + start.plusMinutes(105)));
    }
}

