package com.jttam.glig.domain.location.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;

public record LocationRequest(
    @Size(max = 255, message = "Street address cannot exceed 255 characters")
    String streetAddress,

    @Size(max = 20, message = "Postal code cannot exceed 20 characters")
    String postalCode,

    @NotBlank(message = "City cannot be blank")
    @Size(max = 100, message = "City cannot exceed 100 characters")
    String city,

    @NotBlank(message = "Country cannot be blank")
    @Size(max = 100, message = "Country cannot exceed 100 characters")
    String country,

    BigDecimal latitude,

    BigDecimal longitude
) {
}