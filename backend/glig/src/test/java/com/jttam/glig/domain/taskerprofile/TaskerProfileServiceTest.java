package com.jttam.glig.domain.taskerprofile;

import com.jttam.glig.domain.common.ProfileStatus;
import com.jttam.glig.domain.taskerprofile.dto.TaskerProfileRequest;
import com.jttam.glig.domain.taskerprofile.dto.TaskerProfileResponse;
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
class TaskerProfileServiceTest {

    @Mock
    private TaskerProfileRepository taskerProfileRepository;

    @Mock
    private TaskerProfileMapper taskerProfileMapper;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TaskerProfileService taskerProfileService;

    private String userId;
    private User user;
    private TaskerProfile taskerProfile;
    private TaskerProfileRequest taskerProfileRequest;
    private TaskerProfileResponse taskerProfileResponse;

    @BeforeEach
    void setUp() {
        userId = "auth0|12345";

        user = new User();
        user.setUserName(userId);

        taskerProfile = new TaskerProfile();
        taskerProfile.setTaskerProfileId(1L);
        taskerProfile.setUser(user);
        taskerProfile.setFirstName("Test");
        taskerProfile.setLastName("Tasker");
        taskerProfile.setStatus(ProfileStatus.ACTIVE);

        taskerProfileRequest = new TaskerProfileRequest(
            "Test",
            "Tasker",
            "Test bio",
            "123 Street",
            "12345",
            "Test City",
            "Test Country",
            null,
            null
        );

        taskerProfileResponse = new TaskerProfileResponse(
            1L,
            userId,
            "Test",
            "Tasker",
            null,
            "Test bio",
            "123 Street",
            "12345",
            "Test City",
            "Test Country",
            null,
            null,
            false,
            null,
            null
        );
    }

    @Test
    void getTaskerProfile_shouldReturnProfile_whenExists() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(taskerProfileRepository.findByUser(user)).thenReturn(Optional.of(taskerProfile));
        when(taskerProfileMapper.toResponse(any(TaskerProfile.class))).thenReturn(taskerProfileResponse);

        TaskerProfileResponse result = taskerProfileService.getTaskerProfile(userId);

        assertNotNull(result);
        assertEquals("Test", result.firstName());
        verify(userRepository).findById(userId);
        verify(taskerProfileRepository).findByUser(user);
    }

    @Test
    void getTaskerProfile_shouldCreateProfileAutomatically_whenNotExists() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(taskerProfileRepository.findByUser(user)).thenReturn(Optional.empty());
        when(taskerProfileRepository.save(any(TaskerProfile.class))).thenReturn(taskerProfile);
        when(taskerProfileMapper.toResponse(taskerProfile)).thenReturn(taskerProfileResponse);

        TaskerProfileResponse result = taskerProfileService.getTaskerProfile(userId);

        assertNotNull(result);
        verify(userRepository).findById(userId);
        verify(taskerProfileRepository).findByUser(user);
        verify(taskerProfileRepository).save(any(TaskerProfile.class));
    }

    @Test
    void createTaskerProfile_shouldCreateAndReturnProfile() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(taskerProfileRepository.findByUser(user)).thenReturn(Optional.empty());
        when(taskerProfileMapper.toEntity(any(TaskerProfileRequest.class))).thenReturn(taskerProfile);
        when(taskerProfileRepository.save(any(TaskerProfile.class))).thenReturn(taskerProfile);
        when(taskerProfileMapper.toResponse(any(TaskerProfile.class))).thenReturn(taskerProfileResponse);

        TaskerProfileResponse result = taskerProfileService.createTaskerProfile(userId, taskerProfileRequest);

        assertNotNull(result);
        assertEquals("Test", result.firstName());
        verify(taskerProfileRepository).save(any(TaskerProfile.class));
    }

    @Test
    void createTaskerProfile_shouldThrowException_whenProfileAlreadyExists() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(taskerProfileRepository.findByUser(user)).thenReturn(Optional.of(taskerProfile));

        assertThrows(IllegalStateException.class, () -> {
            taskerProfileService.createTaskerProfile(userId, taskerProfileRequest);
        });

        verify(taskerProfileRepository, never()).save(any(TaskerProfile.class));
    }

    @Test
    void updateTaskerProfile_shouldUpdateAndReturnProfile() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(taskerProfileRepository.findByUser(user)).thenReturn(Optional.of(taskerProfile));
        when(taskerProfileRepository.save(any(TaskerProfile.class))).thenReturn(taskerProfile);
        when(taskerProfileMapper.toResponse(any(TaskerProfile.class))).thenReturn(taskerProfileResponse);

        TaskerProfileResponse result = taskerProfileService.updateTaskerProfile(userId, taskerProfileRequest);

        assertNotNull(result);
        assertEquals("Test", result.firstName());
        verify(taskerProfileMapper).updateFromRequest(taskerProfileRequest, taskerProfile);
        verify(taskerProfileRepository).save(taskerProfile);
    }

    @Test
    void updateTaskerProfile_shouldThrowException_whenProfileNotFound() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(taskerProfileRepository.findByUser(user)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> {
            taskerProfileService.updateTaskerProfile(userId, taskerProfileRequest);
        });

        verify(taskerProfileRepository, never()).save(any(TaskerProfile.class));
    }

    @Test
    void deleteTaskerProfile_shouldSetStatusToDeleted() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(taskerProfileRepository.findByUser(user)).thenReturn(Optional.of(taskerProfile));

        taskerProfileService.deleteTaskerProfile(userId);

        verify(userRepository).findById(userId);
        verify(taskerProfileRepository).findByUser(user);
        verify(taskerProfileRepository).save(taskerProfile);
        assertEquals(ProfileStatus.DELETED, taskerProfile.getStatus());
    }

    @Test
    void deleteTaskerProfile_shouldThrowException_whenProfileNotFound() {
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(taskerProfileRepository.findByUser(user)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> {
            taskerProfileService.deleteTaskerProfile(userId);
        });

        verify(taskerProfileRepository, never()).save(any(TaskerProfile.class));
    }
}
