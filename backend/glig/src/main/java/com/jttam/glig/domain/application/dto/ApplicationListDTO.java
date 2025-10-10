package com.jttam.glig.domain.application.dto;

import java.time.LocalDateTime;
import java.util.Set;

import com.jttam.glig.domain.application.ApplicationStatus;
import com.jttam.glig.domain.category.dto.CategoryResponse;
import com.jttam.glig.domain.user.dto.UserResponse;

public record ApplicationListDTO(UserResponse user,
        Set<CategoryResponse> categories,
        String taskTitle,
        int priceSuggestion,
        LocalDateTime timeSuggestion,
        ApplicationStatus applicationStatus) {

}
