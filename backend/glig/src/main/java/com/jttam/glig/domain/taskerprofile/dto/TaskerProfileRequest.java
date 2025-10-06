package com.jttam.glig.domain.taskerprofile.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.hibernate.validator.constraints.URL;

public record TaskerProfileRequest(
    @NotBlank(message = "First name cannot be blank.")
    @Size(max = 50, message = "First name must be less than 50 characters.")
    String firstName,

    @NotBlank(message = "Last name cannot be blank.")
    @Size(max = 50, message = "Last name must be less than 50 characters.")
    String lastName,

    @Size(max = 5000, message = "Bio must be less than 5000 characters.")
    String bio,

    @Size(max = 255, message = "Street address must be less than 255 characters.")
    String streetAddress,

    @Size(max = 40, message = "Postal code must be less than 40 characters.")
    String postalCode,

    @Size(max = 100, message = "City must be less than 100 characters.")
    String city,

    @Size(max = 100, message = "Country must be less than 100 characters.")
    String country,

    @URL(message = "Website link must be a valid URL.")
    @Size(max = 2048, message = "Website link must be less than 2048 characters.")
    String websiteLink,

    @URL(message = "Profile image URL must be a valid URL.")
    @Size(max = 2048, message = "Profile image URL must be less than 2048 characters.")
    String profileImageUrl
) {
}