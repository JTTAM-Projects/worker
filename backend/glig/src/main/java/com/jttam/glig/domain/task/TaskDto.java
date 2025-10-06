package com.jttam.glig.domain.task;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import com.jttam.glig.domain.user.UserDto;

public record TaskDto(Long id,
        UserDto user,
        @NotNull(message = "Category is required") Category category,
        @NotBlank(message = "Title is required") String title,
        @NotNull(message = "Price is required") Integer price,
        @NotNull(message = "Start date is required") LocalDateTime startDate,
        @NotNull(message = "End date is required") LocalDateTime endDate,
        @NotBlank(message = "Location is required") String location,
        TaskStatus status,
        String description) {
}
