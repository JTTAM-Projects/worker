package com.jttam.glig.domain.application.dto;

import java.time.Instant;
import java.time.LocalDateTime;

import com.jttam.glig.domain.application.ApplicationStatus;
import com.jttam.glig.domain.task.dto.ApplicationListTaskDto;

public record MyApplicationDTO(ApplicationListTaskDto task, LocalDateTime timeSuggestion,
        int priceSuggestion,
        ApplicationStatus applicationStatus,
        Instant createdAt) {

}
