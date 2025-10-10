package com.jttam.glig.domain.user.dto;

public record UserResponse(
        String userName,
        String mail,
        String businessId,
        String phoneNumber,
        String address) {

}
