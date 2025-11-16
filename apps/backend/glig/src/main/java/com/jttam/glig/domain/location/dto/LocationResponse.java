package com.jttam.glig.domain.location.dto;

import java.math.BigDecimal;

public record LocationResponse(
        Long locationId,
        String streetAddress,
        String postalCode,
        String city,
        String country,
        BigDecimal latitude,
        BigDecimal longitude) {
}