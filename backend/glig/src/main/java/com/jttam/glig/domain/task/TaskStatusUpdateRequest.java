package com.jttam.glig.domain.task;

import jakarta.validation.constraints.NotBlank;

public record TaskStatusUpdateRequest(@NotBlank TaskStatus taskStatus) {

}
