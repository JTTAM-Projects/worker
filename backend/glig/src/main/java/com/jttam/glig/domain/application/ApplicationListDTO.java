package com.jttam.glig.domain.application;

import java.time.LocalDateTime;

import com.jttam.glig.domain.task.Category;
import com.jttam.glig.domain.user.UserDto;

public record ApplicationListDTO(UserDto user,
        Category category,
        String taskTitle,
        int priceSuggestion,
        LocalDateTime timeSuggestion,
        ApplicationStatus applicationStatus) {

}
