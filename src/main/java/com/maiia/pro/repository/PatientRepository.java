package com.maiia.pro.repository;

import com.maiia.pro.entity.Patient;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PatientRepository extends CrudRepository<Patient, String> {
    List<Patient> findAll();
}
