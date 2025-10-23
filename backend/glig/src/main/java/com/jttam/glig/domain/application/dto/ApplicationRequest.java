package com.jttam.glig.domain.application.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotNull;

public record ApplicationRequest(
                int priceSuggestion,
                @NotNull(message = "Time Suggestion cannot be null") LocalDateTime timeSuggestion,
                String description) {

}
