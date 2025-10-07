package com.jttam.glig.domain.employerprofile.dto;

import com.jttam.glig.domain.employerprofile.EmployerType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record EmployerProfileRequest(
    String userId,

    @NotBlank(message = "First name cannot be blank.")
    @Size(max = 100, message = "First name must be less than 100 characters.")
    String firstName,

    @NotBlank(message = "Last name cannot be blank.")
    @Size(max = 100, message = "Last name must be less than 100 characters.")
    String lastName,

    @NotNull(message = "Employer type cannot be null")
    EmployerType employerType,

    @Size(max = 255, message = "Street address cannot exceed 255 characters")
    String streetAddress,

    @Size(max = 255, message = "Postal code cannot exceed 255 characters")
    String postalCode,

    @NotBlank(message = "City cannot be blank")
    @Size(max = 255, message = "City cannot exceed 255 characters")
    String city,

    @NotBlank(message = "Country cannot be blank")
    @Size(max = 255, message = "Country cannot exceed 255 characters")
    String country,

    @Size(max = 5000, message = "Bio cannot exceed 5000 characters")
    String bio,

    @Size(max = 255, message = "Company name cannot exceed 255 characters")
    String companyName,

    String businessId,

    @Size(max = 2048, message = "Website link is too long")
    String websiteLink,

    @Size(max = 2048, message = "Profile image URL is too long")
    String profileImageUrl
) {
}