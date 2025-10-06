package com.jttam.glig.domain.application;

import java.time.LocalDateTime;
import com.jttam.glig.domain.task.TaskDto;
import com.jttam.glig.domain.user.UserDto;
import jakarta.validation.constraints.NotNull;

public record ApplicationDto(
        UserDto user,
        TaskDto task,
        @NotNull(message = "Price suggestion is required") int priceSuggestion,
        @NotNull(message = "Time suggestion is required") LocalDateTime timeSuggestion,
        String description,
        ApplicationStatus applicationStatus) {
}
