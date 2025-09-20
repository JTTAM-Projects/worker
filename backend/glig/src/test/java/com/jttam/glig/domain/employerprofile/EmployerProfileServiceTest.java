package com.jttam.glig.domain.employerprofile;

import com.jttam.glig.domain.employerprofile.dto.CreateEmployerProfileRequest;
import com.jttam.glig.domain.employerprofile.dto.EmployerProfileResponse;
import com.jttam.glig.exception.custom.NotFoundException;
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
        employerProfile.setStatus(ProfileStatus.ACTIVE);

        createRequest = new CreateEmployerProfileRequest();
        createRequest.setCompanyName("Test Corp");

        employerProfileResponse = new EmployerProfileResponse();
        employerProfileResponse.setEmployerProfileId(1L);
        employerProfileResponse.setCompanyName("Test Corp");
    }

    @Test
    void getEmployerProfile_shouldReturnProfile_whenExists() {
        when(employerProfileRepository.findByUserId(userId)).thenReturn(Optional.of(employerProfile));
        when(employerProfileMapper.toEmployerProfileResponse(any(EmployerProfile.class))).thenReturn(employerProfileResponse);

        EmployerProfileResponse result = employerProfileService.getEmployerProfile(userId);

        assertNotNull(result);
        assertEquals("Test Corp", result.getCompanyName());
        verify(employerProfileRepository).findByUserId(userId);
    }

    @Test
    void getEmployerProfile_shouldThrowNotFoundException_whenNotExists() {
        when(employerProfileRepository.findByUserId(userId)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> {
            employerProfileService.getEmployerProfile(userId);
        });

        verify(employerProfileRepository).findByUserId(userId);
    }

    @Test
    void createEmployerProfile_shouldCreateAndReturnProfile() {
        when(employerProfileRepository.findByUserId(userId)).thenReturn(Optional.empty());
        when(employerProfileMapper.toEmployerProfile(any(CreateEmployerProfileRequest.class))).thenReturn(employerProfile);
        when(employerProfileRepository.save(any(EmployerProfile.class))).thenReturn(employerProfile);
        when(employerProfileMapper.toEmployerProfileResponse(any(EmployerProfile.class))).thenReturn(employerProfileResponse);

        EmployerProfileResponse result = employerProfileService.createEmployerProfile(createRequest, userId);

        assertNotNull(result);
        assertEquals("Test Corp", result.getCompanyName());
        verify(employerProfileRepository).save(any(EmployerProfile.class));
    }

    @Test
    void createEmployerProfile_shouldThrowException_whenProfileAlreadyExists() {
        when(employerProfileRepository.findByUserId(userId)).thenReturn(Optional.of(employerProfile));

        assertThrows(IllegalStateException.class, () -> {
            employerProfileService.createEmployerProfile(createRequest, userId);
        });

        verify(employerProfileRepository, never()).save(any(EmployerProfile.class));
    }

    @Test
    void updateEmployerProfile_shouldUpdateAndReturnProfile() {
        when(employerProfileRepository.findByUserId(userId)).thenReturn(Optional.of(employerProfile));
        when(employerProfileRepository.save(any(EmployerProfile.class))).thenReturn(employerProfile);
        when(employerProfileMapper.toEmployerProfileResponse(any(EmployerProfile.class))).thenReturn(employerProfileResponse);

        EmployerProfileResponse result = employerProfileService.updateEmployerProfile(createRequest, userId);

        assertNotNull(result);
        assertEquals("Test Corp", result.getCompanyName());
        verify(employerProfileMapper).updateEmployerProfileFromDto(createRequest, employerProfile);
        verify(employerProfileRepository).save(employerProfile);
    }

    @Test
    void updateEmployerProfile_shouldThrowException_whenProfileNotFound() {
        when(employerProfileRepository.findByUserId(userId)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> {
            employerProfileService.updateEmployerProfile(createRequest, userId);
        });

        verify(employerProfileRepository, never()).save(any(EmployerProfile.class));
    }

    @Test
    void deleteEmployerProfile_shouldSetStatusToDeleted() {
        when(employerProfileRepository.findByUserId(userId)).thenReturn(Optional.of(employerProfile));

        employerProfileService.deleteEmployerProfile(userId);

        verify(employerProfileRepository).findByUserId(userId);
        verify(employerProfileRepository).save(employerProfile);
        assertEquals(ProfileStatus.DELETED, employerProfile.getStatus());
    }

    @Test
    void deleteEmployerProfile_shouldThrowException_whenProfileNotFound() {
        when(employerProfileRepository.findByUserId(userId)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> {
            employerProfileService.deleteEmployerProfile(userId);
        });

        verify(employerProfileRepository, never()).save(any(EmployerProfile.class));
    }
}
