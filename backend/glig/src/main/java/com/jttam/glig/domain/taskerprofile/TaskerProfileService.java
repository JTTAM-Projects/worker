package com.jttam.glig.domain.taskerprofile;

import com.jttam.glig.domain.common.ProfileStatus;
import com.jttam.glig.domain.taskerprofile.dto.TaskerProfileRequest;
import com.jttam.glig.domain.taskerprofile.dto.TaskerProfileResponse;
import com.jttam.glig.domain.user.User;
import com.jttam.glig.domain.user.UserRepository;
import com.jttam.glig.exception.custom.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class TaskerProfileService {

    private final TaskerProfileRepository taskerProfileRepository;
    private final TaskerProfileMapper taskerProfileMapper;
    private final UserRepository userRepository;

    public TaskerProfileService(TaskerProfileRepository taskerProfileRepository, 
                                TaskerProfileMapper taskerProfileMapper,
                                UserRepository userRepository) {
        this.taskerProfileRepository = taskerProfileRepository;
        this.taskerProfileMapper = taskerProfileMapper;
        this.userRepository = userRepository;
    }

    public TaskerProfileResponse getTaskerProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("USER_NOT_FOUND", "User not found."));
        
        // Get or create default profile if it doesn't exist (for legacy users)
        TaskerProfile taskerProfile = taskerProfileRepository.findByUser(user)
                .orElseGet(() -> {
                    TaskerProfile newProfile = new TaskerProfile();
                    newProfile.setUser(user);
                    newProfile.setStatus(ProfileStatus.ACTIVE);
                    return taskerProfileRepository.save(newProfile);
                });
        return taskerProfileMapper.toResponse(taskerProfile);
    }

    @Transactional
    public TaskerProfileResponse createTaskerProfile(String userId, TaskerProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("USER_NOT_FOUND", "User not found."));
        
        Optional<TaskerProfile> existingProfile = taskerProfileRepository.findByUser(user);
        if (existingProfile.isPresent()) {
            throw new IllegalStateException("User already has a tasker profile.");
        }

        TaskerProfile taskerProfile = taskerProfileMapper.toEntity(request);
        taskerProfile.setUser(user);
        taskerProfile.setStatus(ProfileStatus.ACTIVE);

        TaskerProfile savedProfile = taskerProfileRepository.save(taskerProfile);
        return taskerProfileMapper.toResponse(savedProfile);
    }

    @Transactional
    public TaskerProfileResponse updateTaskerProfile(String userId, TaskerProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("USER_NOT_FOUND", "User not found."));
        
        TaskerProfile existingProfile = taskerProfileRepository.findByUser(user)
                .orElseThrow(() -> new NotFoundException("TASKER_PROFILE_NOT_FOUND", "TaskerProfile not found for user."));

        taskerProfileMapper.updateFromRequest(request, existingProfile);
        TaskerProfile updatedProfile = taskerProfileRepository.save(existingProfile);
        return taskerProfileMapper.toResponse(updatedProfile);
    }

    @Transactional
    public void deleteTaskerProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("USER_NOT_FOUND", "User not found."));
        
        TaskerProfile taskerProfile = taskerProfileRepository.findByUser(user)
                .orElseThrow(() -> new NotFoundException("TASKER_PROFILE_NOT_FOUND", "TaskerProfile not found for user."));
        taskerProfile.setStatus(ProfileStatus.DELETED);
        taskerProfileRepository.save(taskerProfile);
    }
}
