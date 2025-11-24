package com.jttam.glig.domain.employerprofile;

import com.jttam.glig.domain.common.ProfileStatus;
import com.jttam.glig.domain.employerprofile.dto.EmployerProfileRequest;
import com.jttam.glig.domain.employerprofile.dto.EmployerProfileResponse;
import com.jttam.glig.domain.user.User;
import com.jttam.glig.domain.user.UserRepository;
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

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private EmployerProfileService employerProfileService;

    private String userId;
    private User user;
    private EmployerProfile employerProfile;
    private EmployerProfileRequest createRequest;
    private EmployerProfileResponse employerProfileResponse;

    @BeforeEach
    void setUp() {
        userId = "auth0|12345";

        user = new User();
        user.setUserName(userId);

        employerProfile = new EmployerProfile();
        employerProfile.setEmployerProfileId(1L);
        employerProfile.setUser(user);
        employerProfile.setCompanyName("Test Corp");
        employerProfile.setStreetAddress("123 Test St");
        employerProfile.setCity("Testville");
        employerProfile.setCountry("Testland");
        employerProfile.setStatus(ProfileStatus.ACTIVE);

        createRequest = new EmployerProfileRequest(
            null,
            "John",
            "Doe",
            EmployerType.COMPANY,
            "123 Test St",
            "12345",
            "Testville",
            "Testland",
            "Test bio",
            "Test Corp",
            "123456789",
            null,
            null
        );

        employerProfileResponse = new EmployerProfileResponse(
            1L,
            userId,
            "John",
            "Doe",
            EmployerType.COMPANY,
            "123 Test St",
            "12345",
            "Testville",
            "Testland",
            "Test bio",
            "Test Corp",
            "123456789",
            null,
            null,
            false,
            null,
            null,
            ProfileStatus.ACTIVE
        );
    }

    @Test
    void getEmployerProfile_shouldReturnProfile_whenExists() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(employerProfileRepository.findByUser(user)).thenReturn(Optional.of(employerProfile));
        when(employerProfileMapper.toResponse(any(EmployerProfile.class))).thenReturn(employerProfileResponse);

        EmployerProfileResponse result = employerProfileService.getEmployerProfile(userId);

        assertNotNull(result);
        assertEquals("Test Corp", result.companyName());
        assertEquals("123 Test St", result.streetAddress());
        verify(userRepository).findById(userId);
        verify(employerProfileRepository).findByUser(user);
    }

    @Test
    void getEmployerProfile_shouldCreateProfileAutomatically_whenNotExists() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(employerProfileRepository.findByUser(user)).thenReturn(Optional.empty());
        when(employerProfileRepository.save(any(EmployerProfile.class))).thenReturn(employerProfile);
        when(employerProfileMapper.toResponse(employerProfile)).thenReturn(employerProfileResponse);

        EmployerProfileResponse result = employerProfileService.getEmployerProfile(userId);

        assertNotNull(result);
        verify(userRepository).findById(userId);
        verify(employerProfileRepository).findByUser(user);
        verify(employerProfileRepository).save(any(EmployerProfile.class));
    }

    @Test
    void createEmployerProfile_shouldCreateAndReturnProfile() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(employerProfileRepository.findByUser(user)).thenReturn(Optional.empty());
        when(employerProfileMapper.toEntity(any(EmployerProfileRequest.class))).thenReturn(employerProfile);
        when(employerProfileRepository.save(any(EmployerProfile.class))).thenReturn(employerProfile);
        when(employerProfileMapper.toResponse(any(EmployerProfile.class))).thenReturn(employerProfileResponse);

        EmployerProfileResponse result = employerProfileService.createEmployerProfile(userId, createRequest);

        assertNotNull(result);
        assertEquals("Test Corp", result.companyName());
        assertEquals("123 Test St", result.streetAddress());
        verify(employerProfileRepository).save(any(EmployerProfile.class));
    }

    @Test
    void createEmployerProfile_shouldThrowException_whenProfileAlreadyExists() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(employerProfileRepository.findByUser(user)).thenReturn(Optional.of(employerProfile));

        assertThrows(IllegalStateException.class, () -> {
            employerProfileService.createEmployerProfile(userId, createRequest);
        });

        verify(employerProfileRepository, never()).save(any(EmployerProfile.class));
    }

    @Test
    void updateEmployerProfile_shouldUpdateAndReturnProfile() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(employerProfileRepository.findByUser(user)).thenReturn(Optional.of(employerProfile));
        when(employerProfileRepository.save(any(EmployerProfile.class))).thenReturn(employerProfile);
        when(employerProfileMapper.toResponse(any(EmployerProfile.class))).thenReturn(employerProfileResponse);

        EmployerProfileResponse result = employerProfileService.updateEmployerProfile(userId, createRequest);

        assertNotNull(result);
        assertEquals("Test Corp", result.companyName());
        assertEquals("123 Test St", result.streetAddress());
        verify(employerProfileMapper).updateFromRequest(createRequest, employerProfile);
        verify(employerProfileRepository).save(employerProfile);
    }

    @Test
    void updateEmployerProfile_shouldThrowException_whenProfileNotFound() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(employerProfileRepository.findByUser(user)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> {
            employerProfileService.updateEmployerProfile(userId, createRequest);
        });

        verify(employerProfileRepository, never()).save(any(EmployerProfile.class));
    }

    @Test
    void deleteEmployerProfile_shouldSetStatusToDeleted() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(employerProfileRepository.findByUser(user)).thenReturn(Optional.of(employerProfile));

        employerProfileService.deleteEmployerProfile(userId);

        verify(userRepository).findById(userId);
        verify(employerProfileRepository).findByUser(user);
        verify(employerProfileRepository).save(employerProfile);
        assertEquals(ProfileStatus.DELETED, employerProfile.getStatus());
    }

    @Test
    void deleteEmployerProfile_shouldThrowException_whenProfileNotFound() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(employerProfileRepository.findByUser(user)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> {
            employerProfileService.deleteEmployerProfile(userId);
        });

        verify(employerProfileRepository, never()).save(any(EmployerProfile.class));
    }
}
