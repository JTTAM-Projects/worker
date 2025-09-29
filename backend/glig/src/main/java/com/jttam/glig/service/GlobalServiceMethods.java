package com.jttam.glig.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;
import org.springframework.web.server.ResponseStatusException;

@Service
public class GlobalServiceMethods {

    // public String getUsernameFromJwt() {
    // final Authentication authentication =
    // SecurityContextHolder.getContext().getAuthentication();
    // String username = null;
    // if (authentication.getPrincipal() instanceof Jwt jwt) {
    // username = jwt.getClaimAsString("sub");
    // }
    // return username;
    // }

    public void hasBindingResultErrors(BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    bindingResult.getAllErrors().get(0).getDefaultMessage());
        }
    }
}
