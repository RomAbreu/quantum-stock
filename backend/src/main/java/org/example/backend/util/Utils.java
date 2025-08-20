package org.example.backend.util;

import org.springframework.security.oauth2.jwt.Jwt;

public class Utils {

    public static String extractUsernameFromJwt(Jwt jwt) {
        return jwt.getClaimAsString("preferred_username");
    }
}
