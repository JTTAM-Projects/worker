package com.jttam.glig.domain.application.dto;

import java.time.Instant;

import com.jttam.glig.domain.application.ApplicationStatus;
import com.jttam.glig.domain.user.dto.UserResponse;

public record TaskApplicantDto(UserResponse appliedUser,
        int priceSuggestion,
        Instant createdAt,
        ApplicationStatus applicationStatus) {

}
