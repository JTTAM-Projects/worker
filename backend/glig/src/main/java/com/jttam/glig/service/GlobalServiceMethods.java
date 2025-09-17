package com.jttam.glig.service;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

@Service
public class GlobalServiceMethods {
    public String getUsernameFromJwt() {

        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = null;

        if (authentication.getPrincipal() instanceof Jwt jwt) {
            username = jwt.getClaimAsString("sub");
        }
        return username;
    }
}
