package org.example.backend.steps;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.example.backend.components.QuantumStockHttpClient;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

public class LoginTest {

    private final QuantumStockHttpClient quantumStockHttpClient;
    private ResponseEntity<String> response;

    public LoginTest(QuantumStockHttpClient quantumStockHttpClient) {
        this.quantumStockHttpClient = quantumStockHttpClient;
    }

    @When("I send a POST request to login endpoint with username {string} and password {string}")
    public void  iSendAPostRequestToLoginEndpointWithUsernameAndPassword(String username, String password) {
        response = quantumStockHttpClient.login(username, password);
    }

    @Then("the response status code should be {int}")
    public void theResponseStatusCodeShouldBe(Integer expectedStatus) {
        assertThat(response.getStatusCode().value()).isEqualTo(expectedStatus);
    }

    @And("the response should contain a token")
    public void theResponseShouldContainAToken() {
        String responseBody = response.getBody();
        assertThat(responseBody).isNotNull();
        assertThat(responseBody).contains("access_token");
    }

    @And("the response should a property {string} with value {string}")
    public void theResponseShouldAPropertyWithValue(String messageKey, String messageValue) throws JsonProcessingException {
        String responseBody = response.getBody();
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode jsonNode = objectMapper.readTree(responseBody);

        assertThat(jsonNode.has(messageKey)).isTrue();
        assertThat(jsonNode.get(messageKey).asText()).isEqualTo(messageValue);
    }

    @When("I send a POST request to login endpoint without username and password")
    public void iSendAPOSTRequestToWithoutUsernameAndPassword() {
        response = quantumStockHttpClient.loginNoBody();
    }
}
