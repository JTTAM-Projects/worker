package com.jttam.glig.domain.task;

import java.time.LocalDateTime;

import com.jttam.glig.domain.user.UserDto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record TaskDto(Long id,
                UserDto user,
                @NotNull Category category,
                @NotBlank String title,
                @NotNull Integer price,
                @NotNull LocalDateTime startDate,
                @NotNull LocalDateTime endDate,
                @NotBlank String location,
                TaskStatus status,
                String description) {
}
