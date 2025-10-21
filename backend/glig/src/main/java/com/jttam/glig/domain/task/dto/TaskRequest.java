package com.jttam.glig.domain.task.dto;

import java.time.LocalDateTime;
import java.util.Set;

import com.jttam.glig.domain.category.dto.CategoryRequest;
import com.jttam.glig.domain.location.dto.LocationRequest;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record TaskRequest(
        @NotNull(message = "Category is required") Set<CategoryRequest> categories,
        @NotBlank(message = "Title is required") String title,
        @NotNull(message = "Price is required") Integer price,
        @NotNull(message = "Start date is required") LocalDateTime startDate,
        @NotNull(message = "End date is required") LocalDateTime endDate,
        @NotNull(message = "Location is required") LocationRequest location,
        String description) {

}
