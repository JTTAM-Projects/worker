package com.jttam.glig.domain.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record UserDto(
        String userName,
        @NotBlank @Email String mail,
        String businessId,
        @NotBlank String phoneNumber,
        String address) {

}
