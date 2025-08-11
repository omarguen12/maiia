package com.maiia.pro;

import com.github.javafaker.Faker;
import com.maiia.pro.entity.Appointment;
import com.maiia.pro.entity.Practitioner;
import com.maiia.pro.entity.TimeSlot;

import java.time.LocalDateTime;
import java.util.Locale;

public class EntityFactory {
    final Faker faker = new Faker(Locale.FRANCE);

    public Practitioner createPractitioner() {
        return Practitioner.builder()
                .firstName(faker.name().firstName())
                .lastName(faker.name().lastName())
                .build();
    }

    public TimeSlot createTimeSlot(Integer practitionerId, LocalDateTime startDate, LocalDateTime endDate) {
        return TimeSlot.builder()
                .practitionerId(practitionerId)
                .startDate(startDate)
                .endDate(endDate)
                .build();
    }

    public Appointment createAppointment(Integer practitionerId, Integer patientId, LocalDateTime start, LocalDateTime end) {
        return Appointment.builder()
                .practitionerId(practitionerId)
                .patientId(patientId)
                .startDate(start)
                .endDate(end)
                .build();
    }
}
