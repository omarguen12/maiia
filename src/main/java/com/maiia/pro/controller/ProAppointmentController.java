package com.maiia.pro.controller;

import com.maiia.pro.dto.AppointmentRequest;
import com.maiia.pro.dto.AppointmentResponse;
import com.maiia.pro.entity.Appointment;
import com.maiia.pro.mapper.AppointmentMapper;
import com.maiia.pro.service.ProAppointmentService;
import io.swagger.annotations.ApiOperation;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
@RequestMapping(value = "/appointments", produces = MediaType.APPLICATION_JSON_VALUE)
public class ProAppointmentController {
    @Autowired
    private ProAppointmentService proAppointmentService;

    private final AppointmentMapper mapper = new AppointmentMapper();

    @ApiOperation(value = "Get appointments by practitionerId")
    @GetMapping("/{practitionerId}")
    public List<AppointmentResponse> getAppointmentsByPractitioner(@PathVariable final Integer practitionerId) {
        return proAppointmentService.findByPractitionerId(practitionerId)
                .stream().map(mapper::toResponse).collect(Collectors.toList());
    }

    @ApiOperation(value = "Get all appointments")
    @GetMapping
    public List<AppointmentResponse> getAppointments() {
        return proAppointmentService.findAll().stream().map(mapper::toResponse).collect(Collectors.toList());
    }

    @ApiOperation(value = "Create an appointment")
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public AppointmentResponse create(@Valid @RequestBody AppointmentRequest request) {
        Appointment ap = mapper.toEntity(request);
        Appointment created = proAppointmentService.create(ap);
        return mapper.toResponse(created);
    }
}
