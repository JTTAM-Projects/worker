package com.jttam.glig.domain.application.dto;

import java.time.Instant;

import com.jttam.glig.domain.user.dto.UserResponse;

public record ApplicationListDTO(UserResponse appliedUser,
        int priceSuggestion,
        Instant createdAt) {

}
