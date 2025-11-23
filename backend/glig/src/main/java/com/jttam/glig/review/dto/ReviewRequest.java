package com.jttam.glig.review.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record ReviewRequest(
        @NotNull(message = "Task ID is required") Long taskId,

        @NotNull(message = "Reviewee username is required") String revieweeUsername,

        @NotNull(message = "Rating is required") @Min(value = 1, message = "Rating must be at least 1") @Max(value = 5, message = "Rating must be at most 5") Integer rating,

        @Size(max = 1000, message = "Comment must not exceed 1000 characters") String comment) {
    @Override
    public String toString() {
        return "ReviewRequest{" +
                "taskId=" + taskId +
                ", revieweeUsername='" + revieweeUsername + '\'' +
                ", rating=" + rating +
                ", comment='"
                + (comment != null ? comment.substring(0, Math.min(comment.length(), 20)) + "..." : "null") + '\'' +
                '}';
    }
}
