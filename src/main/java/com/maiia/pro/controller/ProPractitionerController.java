package com.maiia.pro.controller;

import com.maiia.pro.entity.Practitioner;
import com.maiia.pro.service.ProPractitionerService;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping(value = "/practitioners", produces = MediaType.APPLICATION_JSON_VALUE)
public class ProPractitionerController {
    @Autowired
    private ProPractitionerService proPractitionerService;

    @ApiOperation(value = "Get practitioners")
    @GetMapping
    public List<Practitioner> getPractitioners() {
        return proPractitionerService.findAll();
    }
}
