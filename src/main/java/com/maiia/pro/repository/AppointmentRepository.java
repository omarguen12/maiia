package com.maiia.pro.repository;

import com.maiia.pro.entity.Appointment;
import com.maiia.pro.entity.Patient;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends CrudRepository<Appointment, String> {
    List<Appointment> findByPractitionerId(Integer practitionerId);
    List<Appointment> findAll();
}
