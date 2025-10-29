package com.jttam.glig.domain.task;

import java.util.List;

public record TaskDataGridFilters(
        String searchText,              // Text search across title and description
        List<String> categories,        // Multiple category filtering
        Integer minPrice,               // Minimum price filter
        Integer maxPrice,               // Maximum price filter
        Double latitude,                // Location latitude for proximity search
        Double longitude,               // Location longitude for proximity search
        Double radiusKm,                // Radius in kilometers for proximity search
        TaskStatus status               // Task status filter (kept from original)
) {

}
