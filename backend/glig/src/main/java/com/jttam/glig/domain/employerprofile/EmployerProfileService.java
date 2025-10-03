package com.jttam.glig.domain.employerprofile;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jttam.glig.domain.employerprofile.dto.EmployerProfileRequest;
import com.jttam.glig.domain.employerprofile.dto.EmployerProfileResponse;
import com.jttam.glig.exception.custom.NotFoundException;
import com.jttam.glig.service.GlobalServiceMethods;

@Service
public class EmployerProfileService {

    private final EmployerProfileRepository employerProfileRepository;
    private final EmployerProfileMapper employerProfileMapper;
    private final GlobalServiceMethods globalServiceMethods;

    @Autowired
    public EmployerProfileService(
            EmployerProfileRepository employerProfileRepository,
            EmployerProfileMapper employerProfileMapper,
            GlobalServiceMethods globalServiceMethods) {
        this.employerProfileRepository = employerProfileRepository;
        this.employerProfileMapper = employerProfileMapper;
        this.globalServiceMethods = globalServiceMethods;
    }

    @Transactional(readOnly = true)
    public EmployerProfileResponse getEmployerProfile(String userId) {
        EmployerProfile employerProfile = employerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new NotFoundException("NOT_FOUND", "Employer profile not found for user."));
        return employerProfileMapper.toResponse(employerProfile);
    }

    @Transactional
    public EmployerProfileResponse createEmployerProfile(String userId, EmployerProfileRequest request) {
        employerProfileRepository.findByUserId(userId).ifPresent(profile -> {
            throw new IllegalStateException("User already has an employer profile.");
        });

        EmployerProfile newProfile = employerProfileMapper.toEntity(request);
        newProfile.setUserId(userId);
        
        EmployerProfile savedProfile = employerProfileRepository.save(newProfile);
        return employerProfileMapper.toResponse(savedProfile);
    }

    @Transactional
    public EmployerProfileResponse updateEmployerProfile(String userId, EmployerProfileRequest request) {
        EmployerProfile existingProfile = employerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new NotFoundException("NOT_FOUND", "Employer profile not found for user."));

        employerProfileMapper.updateFromRequest(request, existingProfile);
        
        EmployerProfile updatedProfile = employerProfileRepository.save(existingProfile);
        return employerProfileMapper.toResponse(updatedProfile);
    }

    @Transactional
    public void deleteEmployerProfile(String userId) {
        EmployerProfile employerProfile = employerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new NotFoundException("NOT_FOUND", "Employer profile not found for user."));
        
        employerProfile.setStatus(com.jttam.glig.domain.common.ProfileStatus.DELETED);
        employerProfileRepository.save(employerProfile);
    }
}
