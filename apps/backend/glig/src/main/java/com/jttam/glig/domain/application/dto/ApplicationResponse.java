package com.jttam.glig.domain.application.dto;

import java.time.LocalDateTime;

import com.jttam.glig.domain.application.ApplicationStatus;
import com.jttam.glig.domain.task.dto.TaskResponse;
import com.jttam.glig.domain.user.dto.UserResponse;

public record ApplicationResponse(
        UserResponse user,
        TaskResponse task,
        int priceSuggestion,
        LocalDateTime timeSuggestion,
        String description,
        ApplicationStatus applicationStatus) {
}
