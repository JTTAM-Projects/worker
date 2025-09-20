package com.jttam.glig.domain.employerprofile;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.jttam.glig.domain.employerprofile.dto.CreateEmployerProfileRequest;
import com.jttam.glig.domain.employerprofile.dto.EmployerProfileResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/employer-profiles")
public class EmployerProfileController {

    private final EmployerProfileService employerProfileService;

    public EmployerProfileController(EmployerProfileService employerProfileService) {
        this.employerProfileService = employerProfileService;
    }

    @GetMapping("/me")
    public ResponseEntity<EmployerProfileResponse> getMyProfile() {
        EmployerProfileResponse response = employerProfileService.getEmployerProfile();
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<EmployerProfileResponse> createProfile(@Valid @RequestBody CreateEmployerProfileRequest request) {
        EmployerProfileResponse response = employerProfileService.createEmployerProfile(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/me")
    public ResponseEntity<EmployerProfileResponse> updateMyProfile(@Valid @RequestBody CreateEmployerProfileRequest request) {
        EmployerProfileResponse response = employerProfileService.updateEmployerProfile(request);
        return ResponseEntity.ok(response);
    }
}
