package com.jttam.glig.domain.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UserDto(
        @NotBlank(message = "Username is required") String userName,
        @NotBlank(message = "Email is required") @Email(message = "Email must be a valid email address") String mail,
        String businessId,
        @NotBlank(message = "Phone number is required") String phoneNumber,
        String address) {

}
