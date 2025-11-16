package com.jttam.glig.domain.taskerprofile.dto;

import java.math.BigDecimal;
import java.time.Instant;

public record TaskerProfileResponse(
    Long taskerProfileId,
    String userId,
    String firstName,
    String lastName,
    BigDecimal averageRating,
    String bio,
    String streetAddress,
    String postalCode,
    String city,
    String country,
    String websiteLink,
    String profileImageUrl,
    boolean isVerified,
    Instant createdAt,
    Instant updatedAt
) {
}