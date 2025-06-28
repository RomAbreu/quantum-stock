package org.example.backend.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.backend.dtos.ErrorMessage;
import org.example.backend.dtos.KeycloakUserRequest;
import org.example.backend.services.KeycloakService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('role_admin')")
public class UserController {
    private final KeycloakService keycloakService;

    @PostMapping("/create")
    public ResponseEntity<?> createUser(@RequestBody @Valid KeycloakUserRequest userRequest) {
        int status = keycloakService.createUser(userRequest);

        if (status == 201) {
            return  ResponseEntity.status(HttpStatus.CREATED)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body("User created successfully");
        } else if (status == HttpStatus.CONFLICT.value()) {
            ErrorMessage errorMessage = new ErrorMessage(
                    new Date(),
                    HttpStatus.CONFLICT.value(),
                    HttpStatus.CONFLICT.getReasonPhrase(),
                    "User already exists"
            );
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(errorMessage);
        } else {
            ErrorMessage errorMessage = new ErrorMessage(
                    new Date(),
                    HttpStatus.INTERNAL_SERVER_ERROR.value(),
                    HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),
                    "An error occurred while creating the user"
            );
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(errorMessage);
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(keycloakService.getAllUsers());
    }

}
