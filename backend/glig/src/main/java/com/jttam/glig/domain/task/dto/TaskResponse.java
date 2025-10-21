package com.jttam.glig.domain.task.dto;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Set;

import com.jttam.glig.domain.category.dto.CategoryResponse;
import com.jttam.glig.domain.location.dto.LocationResponse;
import com.jttam.glig.domain.task.TaskStatus;
import com.jttam.glig.domain.user.dto.UserResponse;

public record TaskResponse(Long id,
        UserResponse user,
        Set<CategoryResponse> categories,
        String title,
        Integer price,
        LocalDateTime startDate,
        LocalDateTime endDate,
        LocationResponse location,
        TaskStatus status,
        String description,
        Instant createdAt,
        Instant updatedAt) {
}
