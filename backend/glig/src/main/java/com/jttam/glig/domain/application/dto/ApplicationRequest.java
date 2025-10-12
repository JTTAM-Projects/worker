package com.jttam.glig.domain.application.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;

public record ApplicationRequest(
        @NotBlank(message = "Price Suggestion cannot be blank") int priceSuggestion,
        @NotBlank(message = "Time Suggestion cannot be blank") LocalDateTime timeSuggestion,
        String description) {

}
