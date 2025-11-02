package com.jttam.glig.domain.application.dto;

import com.jttam.glig.domain.application.ApplicationStatus;

import jakarta.validation.constraints.NotNull;

public record UpdateApplicationStatusRequest(
        @NotNull ApplicationStatus status) {
}
