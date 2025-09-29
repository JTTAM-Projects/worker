package com.jttam.glig.domain.employerprofile;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jttam.glig.domain.employerprofile.dto.CreateEmployerProfileRequest;
import com.jttam.glig.domain.employerprofile.dto.EmployerProfileResponse;
import com.jttam.glig.exception.custom.NotFoundException;
import com.jttam.glig.service.GlobalServiceMethods;

@Service
public class EmployerProfileService {

    private final EmployerProfileRepository employerProfileRepository;
    private final EmployerProfileMapper employerProfileMapper;

    @Autowired
    public EmployerProfileService(
            EmployerProfileRepository employerProfileRepository,
            EmployerProfileMapper employerProfileMapper,
            GlobalServiceMethods globalServiceMethods) {
        this.employerProfileRepository = employerProfileRepository;
        this.employerProfileMapper = employerProfileMapper;
    }

    @Transactional(readOnly = true)
    public EmployerProfileResponse getEmployerProfile(String userId) {
        EmployerProfile employerProfile = employerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new NotFoundException("NOT_FOUND", "Employer profile not found for user."));
        return employerProfileMapper.toEmployerProfileResponse(employerProfile);
    }

    @Transactional
    public EmployerProfileResponse createEmployerProfile(CreateEmployerProfileRequest request, String userId) {
        employerProfileRepository.findByUserId(userId).ifPresent(profile -> {
            throw new IllegalStateException("User already has an employer profile.");
        });

        EmployerProfile newProfile = employerProfileMapper.toEmployerProfile(request);
        newProfile.setUserId(userId);

        EmployerProfile savedProfile = employerProfileRepository.save(newProfile);
        return employerProfileMapper.toEmployerProfileResponse(savedProfile);
    }

    @Transactional
    public EmployerProfileResponse updateEmployerProfile(CreateEmployerProfileRequest request, String userId) {
        EmployerProfile existingProfile = employerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new NotFoundException("NOT_FOUND", "Employer profile not found for user."));

        employerProfileMapper.updateEmployerProfileFromDto(request, existingProfile);

        EmployerProfile updatedProfile = employerProfileRepository.save(existingProfile);
        return employerProfileMapper.toEmployerProfileResponse(updatedProfile);
    }

    @Transactional
    public void deleteEmployerProfile(String userId) {
        EmployerProfile employerProfile = employerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new NotFoundException("NOT_FOUND", "Employer profile not found for user."));

        employerProfile.setStatus(ProfileStatus.DELETED);
        employerProfileRepository.save(employerProfile);
    }
}
