package com.maiia.pro.mapper;

import com.maiia.pro.dto.AppointmentRequest;
import com.maiia.pro.dto.AppointmentResponse;
import com.maiia.pro.entity.Appointment;

public class AppointmentMapper {

    public Appointment toEntity(AppointmentRequest req) {
        if (req == null) return null;
        return Appointment.builder()
                .practitionerId(req.getPractitionerId())
                .patientId(req.getPatientId())
                .startDate(req.getStartDate())
                .endDate(req.getEndDate())
                .build();
    }

    public AppointmentResponse toResponse(Appointment entity) {
        if (entity == null) return null;
        AppointmentResponse res = new AppointmentResponse();
        res.setId(entity.getId());
        res.setPractitionerId(entity.getPractitionerId());
        res.setPatientId(entity.getPatientId());
        res.setStartDate(entity.getStartDate());
        res.setEndDate(entity.getEndDate());
        return res;
    }
}
