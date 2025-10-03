package com.jttam.glig.domain.taskerprofile;

import com.jttam.glig.domain.common.ProfileStatus;
import com.jttam.glig.domain.taskerprofile.dto.TaskerProfileRequest;
import com.jttam.glig.domain.taskerprofile.dto.TaskerProfileResponse;
import com.jttam.glig.exception.custom.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class TaskerProfileService {

    private final TaskerProfileRepository taskerProfileRepository;
    private final TaskerProfileMapper taskerProfileMapper;

    public TaskerProfileService(TaskerProfileRepository taskerProfileRepository, TaskerProfileMapper taskerProfileMapper) {
        this.taskerProfileRepository = taskerProfileRepository;
        this.taskerProfileMapper = taskerProfileMapper;
    }

    public TaskerProfileResponse getTaskerProfile(String userId) {
        TaskerProfile taskerProfile = taskerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new NotFoundException("TASKER_PROFILE_NOT_FOUND", "TaskerProfile not found for user."));
        return taskerProfileMapper.toResponse(taskerProfile);
    }

    @Transactional
    public TaskerProfileResponse createTaskerProfile(String userId, TaskerProfileRequest request) {
        Optional<TaskerProfile> existingProfile = taskerProfileRepository.findByUserId(userId);
        if (existingProfile.isPresent()) {
            throw new IllegalStateException("User already has a tasker profile.");
        }

        TaskerProfile taskerProfile = taskerProfileMapper.toEntity(request);
        taskerProfile.setUserId(userId);
        taskerProfile.setStatus(ProfileStatus.ACTIVE);

        TaskerProfile savedProfile = taskerProfileRepository.save(taskerProfile);
        return taskerProfileMapper.toResponse(savedProfile);
    }

    @Transactional
    public TaskerProfileResponse updateTaskerProfile(String userId, TaskerProfileRequest request) {
        TaskerProfile existingProfile = taskerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new NotFoundException("TASKER_PROFILE_NOT_FOUND", "TaskerProfile not found for user."));

        taskerProfileMapper.updateFromRequest(request, existingProfile);
        TaskerProfile updatedProfile = taskerProfileRepository.save(existingProfile);
        return taskerProfileMapper.toResponse(updatedProfile);
    }

    @Transactional
    public void deleteTaskerProfile(String userId) {
        TaskerProfile taskerProfile = taskerProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new NotFoundException("TASKER_PROFILE_NOT_FOUND", "TaskerProfile not found for user."));
        taskerProfile.setStatus(ProfileStatus.DELETED);
        taskerProfileRepository.save(taskerProfile);
    }
}
