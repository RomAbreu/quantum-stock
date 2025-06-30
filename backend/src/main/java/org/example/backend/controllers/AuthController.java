package org.example.backend.controllers;

import lombok.RequiredArgsConstructor;
import org.example.backend.dtos.ErrorMessage;
import org.example.backend.dtos.LoginRequest;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Date;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final static String TOKEN_URI = "http://localhost:9090/realms/quantum-stock/protocol/openid-connect/token";

    @PostMapping(value = "/login", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        RestTemplate restTemplate = new RestTemplate();

        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("grant_type", "password");
        form.add("username", loginRequest.username());
        form.add("password", loginRequest.password());
        form.add("client_id", "quantum-stock-backend");

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(form, headers);

        ResponseEntity<String> response;

        try {
            response = restTemplate.postForEntity(
                    TOKEN_URI,
                    request,
                    String.class
            );
        } catch (HttpClientErrorException.Unauthorized e) {
            ErrorMessage errorMessage = new ErrorMessage(
                    new Date(),
                    HttpStatus.UNAUTHORIZED.value(),
                    HttpStatus.UNAUTHORIZED.getReasonPhrase(),
                    "Invalid credentials"
            );
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(errorMessage);
        }

        return ResponseEntity.status(response.getStatusCode())
                .headers(response.getHeaders())
                .body(response.getBody());
    }
}
