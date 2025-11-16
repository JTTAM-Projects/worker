package com.jttam.glig.domain.task.dto;

import java.util.Set;

import com.jttam.glig.domain.category.dto.CategoryResponse;
import com.jttam.glig.domain.location.dto.LocationResponse;
import com.jttam.glig.domain.task.TaskStatus;

public record ApplicationListTaskDto(Long id, String title, Set<CategoryResponse> categories,
        Set<LocationResponse> locations, TaskStatus status) {

}
