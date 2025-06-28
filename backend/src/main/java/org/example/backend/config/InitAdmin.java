package org.example.backend.config;

import lombok.AllArgsConstructor;
import org.example.backend.dtos.KeycloakUserRequest;
import org.example.backend.services.KeycloakService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@AllArgsConstructor
public class InitAdmin implements CommandLineRunner {
    private final KeycloakService keycloakService;

    @Override
    public void run(String... args) {
        KeycloakUserRequest adminUser = new KeycloakUserRequest(
                "admin",
                "admin",
                "Admin",
                "User",
                "admin@admin.com",
                "role_admin"
        );

        keycloakService.createUser(adminUser);
    }
}
