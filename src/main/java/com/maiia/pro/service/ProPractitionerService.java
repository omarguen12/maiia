package com.maiia.pro.service;

import com.maiia.pro.entity.Practitioner;
import com.maiia.pro.repository.PractitionerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProPractitionerService {
    @Autowired
    private PractitionerRepository practitionerRepository;

    public Practitioner find(String practitionerId) {
        return practitionerRepository.findById(practitionerId).orElseThrow();
    }

    public List<Practitioner> findAll() {
        return practitionerRepository.findAll();
    }
}
