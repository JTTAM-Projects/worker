package com.jttam.glig.domain.employerprofile;

import com.jttam.glig.domain.user.User;
import com.jttam.glig.domain.user.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.jttam.glig.domain.employerprofile.dto.EmployerProfileRequest;
import com.jttam.glig.domain.employerprofile.dto.EmployerProfileResponse;
import com.jttam.glig.exception.custom.NotFoundException;

@Service
public class EmployerProfileService {

    private final EmployerProfileRepository employerProfileRepository;
    private final EmployerProfileMapper employerProfileMapper;
    private final UserRepository userRepository;

    public EmployerProfileService(
            EmployerProfileRepository employerProfileRepository,
            EmployerProfileMapper employerProfileMapper,
            UserRepository userRepository) {
        this.employerProfileRepository = employerProfileRepository;
        this.employerProfileMapper = employerProfileMapper;
        this.userRepository = userRepository;
    }

    @Transactional
    public EmployerProfileResponse getEmployerProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("USER_NOT_FOUND", "User not found."));

        // Get or create default profile if it doesn't exist (for legacy users)
        EmployerProfile employerProfile = employerProfileRepository.findByUser(user)
                .orElseGet(() -> {
                    EmployerProfile newProfile = new EmployerProfile();
                    newProfile.setUser(user);
                    newProfile.setEmployerType(EmployerType.INDIVIDUAL);
                    newProfile.setStatus(com.jttam.glig.domain.common.ProfileStatus.ACTIVE);
                    return employerProfileRepository.save(newProfile);
                });
        return employerProfileMapper.toResponse(employerProfile);
    }

    @Transactional
    public EmployerProfileResponse createEmployerProfile(String userId, EmployerProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("USER_NOT_FOUND", "User not found."));

        employerProfileRepository.findByUser(user).ifPresent(profile -> {
            throw new IllegalStateException("User already has an employer profile.");
        });

        EmployerProfile newProfile = employerProfileMapper.toEntity(request);
        newProfile.setUser(user);

        EmployerProfile savedProfile = employerProfileRepository.save(newProfile);
        return employerProfileMapper.toResponse(savedProfile);
    }

    @Transactional
    public EmployerProfileResponse updateEmployerProfile(String userId, EmployerProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("USER_NOT_FOUND", "User not found."));

        EmployerProfile existingProfile = employerProfileRepository.findByUser(user)
                .orElseThrow(() -> new NotFoundException("NOT_FOUND",
                        "Employer profile not found for user."));

        employerProfileMapper.updateFromRequest(request, existingProfile);

        EmployerProfile updatedProfile = employerProfileRepository.save(existingProfile);
        return employerProfileMapper.toResponse(updatedProfile);
    }

    @Transactional
    public void deleteEmployerProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("USER_NOT_FOUND", "User not found."));

        EmployerProfile employerProfile = employerProfileRepository.findByUser(user)
                .orElseThrow(() -> new NotFoundException("NOT_FOUND",
                        "Employer profile not found for user."));

        employerProfile.setStatus(com.jttam.glig.domain.common.ProfileStatus.DELETED);
        employerProfileRepository.save(employerProfile);
    }
}
