package com.jttam.glig.domain.task;

import jakarta.validation.constraints.NotNull;

public record TaskStatusUpdateRequest(@NotNull TaskStatus taskStatus) {

}
