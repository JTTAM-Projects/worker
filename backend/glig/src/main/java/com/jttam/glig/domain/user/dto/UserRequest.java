package com.jttam.glig.domain.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UserRequest(
        @NotBlank(message = "Email is required") @Email(message = "Email must be a valid email address") String mail,
        String businessId,
        String phoneNumber,
        String address) {

}
