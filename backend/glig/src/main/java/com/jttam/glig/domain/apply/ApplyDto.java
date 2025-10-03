package com.jttam.glig.domain.apply;

import java.time.LocalDateTime;
import com.jttam.glig.domain.task.TaskDto;
import com.jttam.glig.domain.user.UserDto;
import jakarta.validation.constraints.NotNull;

public record ApplyDto(
        UserDto user,
        TaskDto task,
        @NotNull int priceSuggestion,
        @NotNull LocalDateTime timeSuggestion,
        String description,
        ApplyStatus applyStatus) {
}
