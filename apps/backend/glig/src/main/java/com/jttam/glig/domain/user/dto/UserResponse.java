package com.jttam.glig.domain.user.dto;

import java.time.Instant;

public record UserResponse(
        String userName,
        String mail,
        String businessId,
        String phoneNumber,
        String address,
        Instant createdAt) {

}
