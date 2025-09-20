package com.jttam.glig.domain.employerprofile;

import com.jttam.glig.domain.employerprofile.dto.CreateEmployerProfileRequest;
import com.jttam.glig.domain.employerprofile.dto.EmployerProfileResponse;
import com.jttam.glig.exception.custom.NotFoundException;
import com.jttam.glig.service.GlobalServiceMethods;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EmployerProfileServiceTest {

    @Mock
    private EmployerProfileRepository employerProfileRepository;

    @Mock
    private EmployerProfileMapper employerProfileMapper;

    @Mock
    private GlobalServiceMethods globalServiceMethods;

    @InjectMocks
    private EmployerProfileService employerProfileService;

    private String userId;
    private EmployerProfile employerProfile;
    private CreateEmployerProfileRequest createRequest;
    private EmployerProfileResponse employerProfileResponse;

    @BeforeEach
    void setUp() {
        userId = "auth0|12345";

        employerProfile = new EmployerProfile();
        employerProfile.setEmployerProfileId(1L);
        employerProfile.setUserId(userId);
        employerProfile.setCompanyName("Test Corp");

        createRequest = new CreateEmployerProfileRequest();
        createRequest.setCompanyName("Test Corp");
        createRequest.setUserId(userId);

        employerProfileResponse = new EmployerProfileResponse();
        employerProfileResponse.setEmployerProfileId(1L);
        employerProfileResponse.setCompanyName("Test Corp");
    }

    @Test
    void getEmployerProfile_shouldReturnProfile_whenExists() {
        when(globalServiceMethods.getUsernameFromJwt()).thenReturn(userId);
        when(employerProfileRepository.findByUserId(userId)).thenReturn(Optional.of(employerProfile));
        when(employerProfileMapper.toEmployerProfileResponse(any(EmployerProfile.class))).thenReturn(employerProfileResponse);

        EmployerProfileResponse result = employerProfileService.getEmployerProfile();

        assertNotNull(result);
        assertEquals("Test Corp", result.getCompanyName());
        verify(employerProfileRepository).findByUserId(userId);
    }

    @Test
    void getEmployerProfile_shouldThrowNotFoundException_whenNotExists() {
        when(globalServiceMethods.getUsernameFromJwt()).thenReturn(userId);
        when(employerProfileRepository.findByUserId(userId)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> {
            employerProfileService.getEmployerProfile();
        });

        verify(employerProfileRepository).findByUserId(userId);
    }

    @Test
    void createEmployerProfile_shouldCreateAndReturnProfile() {
        when(globalServiceMethods.getUsernameFromJwt()).thenReturn(userId);
        when(employerProfileRepository.findByUserId(userId)).thenReturn(Optional.empty());
        when(employerProfileMapper.toEmployerProfile(any(CreateEmployerProfileRequest.class))).thenReturn(employerProfile);
        when(employerProfileRepository.save(any(EmployerProfile.class))).thenReturn(employerProfile);
        when(employerProfileMapper.toEmployerProfileResponse(any(EmployerProfile.class))).thenReturn(employerProfileResponse);

        EmployerProfileResponse result = employerProfileService.createEmployerProfile(createRequest);

        assertNotNull(result);
        assertEquals("Test Corp", result.getCompanyName());
        verify(employerProfileRepository).save(any(EmployerProfile.class));
    }

    @Test
    void createEmployerProfile_shouldThrowException_whenProfileAlreadyExists() {
        when(globalServiceMethods.getUsernameFromJwt()).thenReturn(userId);
        when(employerProfileRepository.findByUserId(userId)).thenReturn(Optional.of(employerProfile));

        assertThrows(IllegalStateException.class, () -> {
            employerProfileService.createEmployerProfile(createRequest);
        });

        verify(employerProfileRepository, never()).save(any(EmployerProfile.class));
    }

    @Test
    void updateEmployerProfile_shouldUpdateAndReturnProfile() {
        when(globalServiceMethods.getUsernameFromJwt()).thenReturn(userId);
        when(employerProfileRepository.findByUserId(userId)).thenReturn(Optional.of(employerProfile));
        when(employerProfileRepository.save(any(EmployerProfile.class))).thenReturn(employerProfile);
        when(employerProfileMapper.toEmployerProfileResponse(any(EmployerProfile.class))).thenReturn(employerProfileResponse);

        EmployerProfileResponse result = employerProfileService.updateEmployerProfile(createRequest);

        assertNotNull(result);
        assertEquals("Test Corp", result.getCompanyName());
        verify(employerProfileMapper).updateEmployerProfileFromDto(createRequest, employerProfile);
        verify(employerProfileRepository).save(employerProfile);
    }

    @Test
    void updateEmployerProfile_shouldThrowException_whenProfileNotFound() {
        when(globalServiceMethods.getUsernameFromJwt()).thenReturn(userId);
        when(employerProfileRepository.findByUserId(userId)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> {
            employerProfileService.updateEmployerProfile(createRequest);
        });

        verify(employerProfileRepository, never()).save(any(EmployerProfile.class));
    }
}
