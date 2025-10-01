package com.jttam.glig.domain.apply;

import java.time.LocalDateTime;

import com.jttam.glig.domain.task.Category;
import com.jttam.glig.domain.user.UserDto;

public record ApplyListDTO(UserDto user,
                Category category,
                String taskTitle,
                int priceSuggestion,
                LocalDateTime timeSuggestion,
                ApplyStatus applyStatus) {

}
