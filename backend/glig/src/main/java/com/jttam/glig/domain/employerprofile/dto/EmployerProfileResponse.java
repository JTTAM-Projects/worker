package com.jttam.glig.domain.employerprofile.dto;

import java.time.Instant;
import com.jttam.glig.domain.employerprofile.EmployerType;
import com.jttam.glig.domain.common.ProfileStatus;

public record EmployerProfileResponse(
    Long employerProfileId,
    String userId,
    String firstName,
    String lastName,
    EmployerType employerType,
    String streetAddress,
    String postalCode,
    String city,
    String country,
    String bio,
    String companyName,
    String businessId,
    String websiteLink,
    String profileImageUrl,
    boolean isVerified,
    Instant createdAt,
    Instant updatedAt,
    ProfileStatus status
) {
}