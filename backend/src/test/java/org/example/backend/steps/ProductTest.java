package org.example.backend.steps;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.example.backend.components.QuantumStockHttpClient;
import org.example.backend.models.Product;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import java.math.BigDecimal;
import java.util.List;

public class ProductTest {

    private final QuantumStockHttpClient quantumStockHttpClient;
    private String accessToken;
    private Product product;
    private ResponseEntity<String> response;

    public ProductTest(QuantumStockHttpClient quantumStockHttpClient) {
        this.quantumStockHttpClient = quantumStockHttpClient;
    }

    @Given("I am an authenticated admin user with credentials {string} and {string}")
    public void iAmAnAuthenticatedAdminUserWithCredentialsAnd(String username, String password) {
        accessToken = quantumStockHttpClient.getAccessToken(username, password);
        if (accessToken == null || accessToken.isEmpty()) {
            throw new RuntimeException("Failed to authenticate user: " + username);
        }
    }

    @When("I send a POST request to create product endpoint with the following product data:")
    public void iSendAPOSTRequestToCreateProductEndpointWithTheFollowingProductData(DataTable productData) {
        List<List<String>> rows = productData.asLists(String.class);

        rows.stream().skip(1).forEach(row -> {
            product = new Product();
            product.setName(row.get(0));
            product.setDescription(row.get(1));
            product.setPrice(new BigDecimal(row.get(2)));
            product.setCategory(row.get(3));
            product.setQuantity(Integer.parseInt(row.get(4)));
            product.setMinQuantity(Integer.parseInt(row.get(5)));
        });

        response = quantumStockHttpClient.createProduct(product, accessToken);
    }

    @Then("the response status code should be {int}")
    public void theResponseStatusCodeShouldBe(int status) {
        assertThat(response.getStatusCode().value()).isEqualTo(status);
    }

    @And("the response body should contain the error message {string}")
    public void theResponseBodyShouldContainTheErrorMessage(String errorMessage) {
        String responseBody = response.getBody();
        assertThat(responseBody).contains(errorMessage);
    }

    @When("I send a PUT request to update product endpoint with the following product data:")
    public void iSendAPUTRequestToUpdateProductEndpointWithTheFollowingProductData(DataTable productData) {
        List<List<String>> rows = productData.asLists(String.class);

        rows.stream().skip(1).forEach(row -> {
            product = new Product();
            product.setId(Long.parseLong(row.get(0)));
            product.setName(row.get(1));
            product.setDescription(row.get(2));
            product.setPrice(new BigDecimal(row.get(3)));
            product.setCategory(row.get(4));
            product.setQuantity(Integer.parseInt(row.get(5)));
            product.setMinQuantity(Integer.parseInt(row.get(6)));
        });

        response = quantumStockHttpClient.updateProduct(product, accessToken);
    }
}
