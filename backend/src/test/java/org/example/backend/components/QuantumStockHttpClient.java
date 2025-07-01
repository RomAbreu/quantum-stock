package org.example.backend.components;

import org.example.backend.dtos.LoginRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.context.annotation.Scope;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;

import static io.cucumber.spring.CucumberTestContext.SCOPE_CUCUMBER_GLUE;

@Component
@Scope(SCOPE_CUCUMBER_GLUE)
public class QuantumStockHttpClient {

    private final static String SERVER_URL = "http://localhost:";
    private final static String LOGIN_ENDPOINT = "/api/v1/auth/login";

    @LocalServerPort
    private String port;

    private final TestRestTemplate restTemplate;

    public QuantumStockHttpClient(TestRestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    private String getLoginUrl() {
        return SERVER_URL + port + LOGIN_ENDPOINT;
    }

    public ResponseEntity<String> login(String username, String password) {
        LoginRequest body = new LoginRequest(username, password);
        return restTemplate.postForEntity(getLoginUrl(), body, String.class);
    }

    public ResponseEntity<String> loginNoBody() {
        return restTemplate.postForEntity(getLoginUrl(), null, String.class);
    }
}
