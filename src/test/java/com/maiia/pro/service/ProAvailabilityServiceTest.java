package com.maiia.pro.service;

import com.maiia.pro.EntityFactory;
import com.maiia.pro.entity.Availability;
import com.maiia.pro.entity.Practitioner;
import com.maiia.pro.repository.AppointmentRepository;
import com.maiia.pro.repository.AvailabilityRepository;
import com.maiia.pro.repository.PractitionerRepository;
import com.maiia.pro.repository.TimeSlotRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDateTime;
import java.time.Month;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest
class ProAvailabilityServiceTest {
    private final  EntityFactory entityFactory = new EntityFactory();
    private  final static Integer patient_id=657679;
    @Autowired
    private ProAvailabilityService proAvailabilityService;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private AvailabilityRepository availabilityRepository;

    @Autowired
    private PractitionerRepository practitionerRepository;

    @Autowired
    private TimeSlotRepository timeSlotRepository;

    @Test
    void generateAvailabilities() {
        Practitioner practitioner = practitionerRepository.save(entityFactory.createPractitioner());
        LocalDateTime startDate = LocalDateTime.of(2020, Month.FEBRUARY, 5, 11, 0, 0);
        timeSlotRepository.save(entityFactory.createTimeSlot(practitioner.getId(), startDate, startDate.plusHours(1)));

        List<Availability> availabilities = proAvailabilityService.generateAvailabilities(practitioner.getId());

        assertEquals(4, availabilities.size());

        List<LocalDateTime> availabilitiesStartDate = availabilities.stream().map(Availability::getStartDate).collect(Collectors.toList());
        ArrayList<LocalDateTime> expectedStartDate = new ArrayList<>();
        expectedStartDate.add(startDate);
        expectedStartDate.add(startDate.plusMinutes(15));
        expectedStartDate.add(startDate.plusMinutes(30));
        expectedStartDate.add(startDate.plusMinutes(45));
        assertTrue(availabilitiesStartDate.containsAll(expectedStartDate));
    }

    @Test
    void checkAvailabilitiesAreNotDuplicated() {
        Practitioner practitioner = practitionerRepository.save(entityFactory.createPractitioner());
        LocalDateTime startDate = LocalDateTime.of(2020, Month.FEBRUARY, 5, 11, 0, 0);
        timeSlotRepository.save(entityFactory.createTimeSlot(practitioner.getId(), startDate, startDate.plusHours(1)));

        availabilityRepository.save(Availability.builder().practitionerId(practitioner.getId()).startDate(startDate).endDate(startDate.plusMinutes(15)).build());
        availabilityRepository.save(Availability.builder().practitionerId(practitioner.getId()).startDate(startDate.plusMinutes(15)).endDate(startDate.plusMinutes(30)).build());
        availabilityRepository.save(Availability.builder().practitionerId(practitioner.getId()).startDate(startDate.plusMinutes(35)).endDate(startDate.plusMinutes(45)).build());
        availabilityRepository.save(Availability.builder().practitionerId(practitioner.getId()).startDate(startDate.plusMinutes(45)).endDate(startDate.plusHours(1)).build());

        proAvailabilityService.generateAvailabilities(practitioner.getId());

        List<Availability> availabilities = proAvailabilityService.findByPractitionerId(practitioner.getId());
        assertEquals(4, availabilities.size());
    }

    @Test
    void generateAvailabilityWithOneAppointment() {
        Practitioner practitioner = practitionerRepository.save(entityFactory.createPractitioner());
        LocalDateTime startDate = LocalDateTime.of(2020, Month.FEBRUARY, 5, 11, 0, 0);
        timeSlotRepository.save(entityFactory.createTimeSlot(practitioner.getId(), startDate, startDate.plusHours(1)));
        appointmentRepository.save(entityFactory.createAppointment(practitioner.getId(),
                patient_id,
                startDate.plusMinutes(30),
                startDate.plusMinutes(45)));

        List<Availability> availabilities = proAvailabilityService.generateAvailabilities(practitioner.getId());

        assertEquals(3, availabilities.size());

        List<LocalDateTime> availabilitiesStartDate = availabilities.stream().map(Availability::getStartDate).collect(Collectors.toList());
        ArrayList<LocalDateTime> expectedStartDate = new ArrayList<>();
        expectedStartDate.add(startDate);
        expectedStartDate.add(startDate.plusMinutes(15));
        expectedStartDate.add(startDate.plusMinutes(45));
        assertTrue(availabilitiesStartDate.containsAll(expectedStartDate));
    }

    @Test
    void generateAvailabilityWithExistingAppointments() {
        Practitioner practitioner = practitionerRepository.save(entityFactory.createPractitioner());
        LocalDateTime startDate = LocalDateTime.of(2020, Month.FEBRUARY, 5, 11, 0, 0);
        timeSlotRepository.save(entityFactory.createTimeSlot(practitioner.getId(), startDate, startDate.plusHours(1)));
        appointmentRepository.save(entityFactory.createAppointment(practitioner.getId(),
                patient_id,
                startDate,
                startDate.plusMinutes(15)));

        appointmentRepository.save(entityFactory.createAppointment(practitioner.getId(),
                patient_id,
                startDate.plusMinutes(30),
                startDate.plusMinutes(45)));

        List<Availability> availabilities = proAvailabilityService.generateAvailabilities(practitioner.getId());

        assertEquals(2, availabilities.size());

        List<LocalDateTime> availabilitiesStartDate = availabilities.stream().map(Availability::getStartDate).collect(Collectors.toList());
        ArrayList<LocalDateTime> expectedStartDate = new ArrayList<>();
        expectedStartDate.add(startDate.plusMinutes(15));
        expectedStartDate.add(startDate.plusMinutes(45));
        assertTrue(availabilitiesStartDate.containsAll(expectedStartDate));
    }

    @Test
    void generateAvailabilitiesWithExistingTwentyMinutesAppointment() {
        Practitioner practitioner = practitionerRepository.save(entityFactory.createPractitioner());
        LocalDateTime startDate = LocalDateTime.of(2020, Month.FEBRUARY, 5, 11, 0, 0);
        timeSlotRepository.save(entityFactory.createTimeSlot(practitioner.getId(), startDate, startDate.plusHours(1)));
        appointmentRepository.save(entityFactory.createAppointment(practitioner.getId(),
                patient_id,
                startDate.plusMinutes(15),
                startDate.plusMinutes(35)));

        List<Availability> availabilities = proAvailabilityService.generateAvailabilities(practitioner.getId());

        assertTrue(availabilities.size() >= 2);
    }

    @Test
    void generateAvailabilitiesWithAppointmentOnTwoAvailabilities() {
        Practitioner practitioner = practitionerRepository.save(entityFactory.createPractitioner());
        LocalDateTime startDate = LocalDateTime.of(2020, Month.FEBRUARY, 5, 11, 0, 0);
        timeSlotRepository.save(entityFactory.createTimeSlot(practitioner.getId(), startDate, startDate.plusHours(1)));
        appointmentRepository.save(entityFactory.createAppointment(practitioner.getId(),
                patient_id,
                startDate.plusMinutes(20),
                startDate.plusMinutes(35)));

        List<Availability> availabilities = proAvailabilityService.generateAvailabilities(practitioner.getId());

        assertTrue(availabilities.size() >= 2);
    }

    @Test
    void generateOptimalAvailabilitiesWithExistingTwentyMinutesAppointment() {
        Practitioner practitioner = practitionerRepository.save(entityFactory.createPractitioner());
        LocalDateTime startDate = LocalDateTime.of(2020, Month.FEBRUARY, 5, 11, 0, 0);
        timeSlotRepository.save(entityFactory.createTimeSlot(practitioner.getId(), startDate, startDate.plusHours(1)));
        appointmentRepository.save(entityFactory.createAppointment(practitioner.getId(),
                patient_id,
                startDate.plusMinutes(15),
                startDate.plusMinutes(35)));

        List<Availability> availabilities = proAvailabilityService.generateAvailabilities(practitioner.getId());

        assertEquals(3, availabilities.size());

        List<LocalDateTime> availabilitiesStartDate = availabilities.stream().map(Availability::getStartDate).collect(Collectors.toList());
        ArrayList<LocalDateTime> expectedStartDate = new ArrayList<>();
        expectedStartDate.add(startDate);
        expectedStartDate.add(startDate.plusMinutes(35));
        expectedStartDate.add(startDate.plusMinutes(50));
        assertTrue(availabilitiesStartDate.containsAll(expectedStartDate));
    }

    @Test
    void generateOptimalAvailabilitiesWithAppointmentOnTwoAvailabilities() {
        Practitioner practitioner = practitionerRepository.save(entityFactory.createPractitioner());
        LocalDateTime startDate = LocalDateTime.of(2020, Month.FEBRUARY, 5, 11, 0, 0);
        timeSlotRepository.save(entityFactory.createTimeSlot(practitioner.getId(), startDate, startDate.plusHours(1)));
        appointmentRepository.save(entityFactory.createAppointment(practitioner.getId(),
                patient_id,
                startDate.plusMinutes(20),
                startDate.plusMinutes(35)));

        List<Availability> availabilities = proAvailabilityService.generateAvailabilities(practitioner.getId());

        assertEquals(3, availabilities.size());

        List<LocalDateTime> availabilitiesStartDate = availabilities.stream().map(Availability::getStartDate).collect(Collectors.toList());
        ArrayList<LocalDateTime> expectedStartDate = new ArrayList<>();
        expectedStartDate.add(startDate);
        expectedStartDate.add(startDate.plusMinutes(35));
        expectedStartDate.add(startDate.plusMinutes(50));
        assertTrue(availabilitiesStartDate.containsAll(expectedStartDate));
    }
}
