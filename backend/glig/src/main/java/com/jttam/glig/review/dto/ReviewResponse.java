package com.jttam.glig.review.dto;

import java.time.LocalDateTime;

public record ReviewResponse(
    Long id,
    Long taskId,
    String taskTitle,
    String reviewerUsername,
    String revieweeUsername,
    int rating,
    String comment,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {
    @Override
    public String toString() {
        return "ReviewResponse{" +
                "id=" + id +
                ", taskId=" + taskId +
                ", taskTitle='" + taskTitle + '\'' +
                ", reviewerUsername='" + reviewerUsername + '\'' +
                ", revieweeUsername='" + revieweeUsername + '\'' +
                ", rating=" + rating +
                ", comment='" + (comment != null ? comment.substring(0, Math.min(comment.length(), 20)) + "..." : "null") + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
