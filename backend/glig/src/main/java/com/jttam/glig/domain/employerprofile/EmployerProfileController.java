package com.jttam.glig.domain.employerprofile;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import com.jttam.glig.domain.employerprofile.dto.EmployerProfileRequest;
import com.jttam.glig.domain.employerprofile.dto.EmployerProfileResponse;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/employer-profiles")
public class EmployerProfileController {

    private final EmployerProfileService employerProfileService;

    public EmployerProfileController(EmployerProfileService employerProfileService) {
        this.employerProfileService = employerProfileService;
    }

    @GetMapping("/me")
    public ResponseEntity<EmployerProfileResponse> getMyProfile(@AuthenticationPrincipal Jwt jwt) {
        EmployerProfileResponse response = employerProfileService.getEmployerProfile(getUserId(jwt));
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<EmployerProfileResponse> createProfile(@Valid @RequestBody EmployerProfileRequest request, @AuthenticationPrincipal Jwt jwt) {
        EmployerProfileResponse response = employerProfileService.createEmployerProfile(getUserId(jwt), request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/me")
    public ResponseEntity<EmployerProfileResponse> updateMyProfile(@Valid @RequestBody EmployerProfileRequest request, @AuthenticationPrincipal Jwt jwt) {
        EmployerProfileResponse response = employerProfileService.updateEmployerProfile(getUserId(jwt), request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteMyProfile(@AuthenticationPrincipal Jwt jwt) {
        employerProfileService.deleteEmployerProfile(getUserId(jwt));
        return ResponseEntity.noContent().build();
    }

    private String getUserId(Jwt jwt) {
        return jwt.getSubject();
    }
}
