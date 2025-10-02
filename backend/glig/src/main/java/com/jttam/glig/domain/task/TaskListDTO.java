package com.jttam.glig.domain.task;

import java.time.LocalDateTime;

import com.jttam.glig.domain.user.UserDto;

public record TaskListDTO(Long id,
        UserDto user,
        Category category,
        String title,
        Integer price,
        LocalDateTime startDate,
        LocalDateTime endDate,
        String location,
        TaskStatus status,
        String description) {
}
