package com.jttam.glig.domain.taskerprofile;

import com.jttam.glig.domain.taskerprofile.dto.TaskerProfileRequest;
import com.jttam.glig.domain.taskerprofile.dto.TaskerProfileResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasker-profiles")
public class TaskerProfileController {

    private final TaskerProfileService taskerProfileService;

    public TaskerProfileController(TaskerProfileService taskerProfileService) {
        this.taskerProfileService = taskerProfileService;
    }

    @GetMapping("/me")
    public ResponseEntity<TaskerProfileResponse> getMyProfile(@AuthenticationPrincipal Jwt jwt) {
        TaskerProfileResponse profile = taskerProfileService.getTaskerProfile(getUserId(jwt));
        return ResponseEntity.ok(profile);
    }

    @PostMapping
    public ResponseEntity<TaskerProfileResponse> createProfile(
            @Valid @RequestBody TaskerProfileRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        TaskerProfileResponse createdProfile = taskerProfileService.createTaskerProfile(getUserId(jwt), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProfile);
    }

    @PutMapping("/me")
    public ResponseEntity<TaskerProfileResponse> updateMyProfile(
            @Valid @RequestBody TaskerProfileRequest request,
            @AuthenticationPrincipal Jwt jwt) {
        TaskerProfileResponse updatedProfile = taskerProfileService.updateTaskerProfile(getUserId(jwt), request);
        return ResponseEntity.ok(updatedProfile);
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteMyProfile(@AuthenticationPrincipal Jwt jwt) {
        taskerProfileService.deleteTaskerProfile(getUserId(jwt));
        return ResponseEntity.noContent().build();
    }

    private String getUserId(Jwt jwt) {
        return jwt.getSubject();
    }
}
