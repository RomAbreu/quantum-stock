package org.example.backend.steps;

import com.fasterxml.jackson.databind.ObjectMapper;
import io.cucumber.datatable.DataTable;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.example.backend.components.QuantumStockHttpClient;
import org.example.backend.dtos.PaginatedResponse;
import org.example.backend.dtos.ProductFilter;
import org.example.backend.enums.Category;
import org.example.backend.models.Product;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class ProductTest {

    private final QuantumStockHttpClient quantumStockHttpClient;
    private String accessToken;
    private final List<Product> products;
    private ResponseEntity<String> response;

    public ProductTest(QuantumStockHttpClient quantumStockHttpClient) {
        this.quantumStockHttpClient = quantumStockHttpClient;
        this.products = new ArrayList<>();
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
        fromDataTableToProductCreate(productData);
        response = quantumStockHttpClient.createProduct(products.getFirst(), accessToken);
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
        fromDataTableToProductUpdate(productData);
        response = quantumStockHttpClient.updateProduct(products.getFirst(), accessToken);
    }

    @When("I send a DELETE request to delete product endpoint with product ID {int}")
    public void iSendADELETERequestToDeleteProductEndpointWithProductID(int productId) {
        response = quantumStockHttpClient.deleteProduct(productId, accessToken);
    }

    private void fromDataTableToProductCreate(DataTable productData) {
        List<List<String>> rows = productData.asLists(String.class);

        rows.stream().skip(1).forEach(row -> {
            Product product = new Product();
            product.setName(row.get(0));
            product.setDescription(row.get(1));
            product.setPrice(new BigDecimal(row.get(2)));
            product.setCategory(Category.valueOf(row.get(3)));
            product.setQuantity(Integer.parseInt(row.get(4)));
            product.setMinQuantity(Integer.parseInt(row.get(5)));
            products.add(product);
        });
    }

    private void fromDataTableToProductUpdate(DataTable productData) {
        List<List<String>> rows = productData.asLists(String.class);

        rows.stream().skip(1).forEach(row -> {
            Product product = new Product();
            product.setId(Long.parseLong(row.get(0)));
            product.setName(row.get(1));
            product.setDescription(row.get(2));
            product.setPrice(new BigDecimal(row.get(3)));
            product.setCategory(Category.valueOf(row.get(4)));
            product.setQuantity(Integer.parseInt(row.get(5)));
            product.setMinQuantity(Integer.parseInt(row.get(6)));
            products.add(product);
        });
    }

    @When("I send a GET request to retrieve all products without filters")
    public void iSendAGETRequestToRetrieveAllProductsWithoutFilters() {
        response = quantumStockHttpClient.getAllProducts(null);
    }

    @And("the response should contain {int} products")
    public void theResponseShouldContainProducts(int expectedCount) {
        String responseBody = response.getBody();
        ObjectMapper objectMapper = new ObjectMapper();

        try {
            PaginatedResponse<Product> paginatedResponse = objectMapper.readValue(
                    responseBody,
                    objectMapper.getTypeFactory().constructParametricType(
                            PaginatedResponse.class,
                            Product.class
                    )
            );
            List<Product> productList = paginatedResponse.getContent();
            assertThat(productList.size()).isEqualTo(expectedCount);
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse response body", e);
        }
    }

    @When("I send a POST request to create product endpoint with the following products data:")
    public void iSendAPOSTRequestToCreateProductEndpointWithTheFollowingProductsData(DataTable productsData) {
        fromDataTableToProductCreate(productsData);
        products.forEach(product -> quantumStockHttpClient.createProduct(product, accessToken));
    }

    @When("I send a GET request to retrieve products with name {string}")
    public void iSendAGETRequestToRetrieveProductsWithName(String productName) {
        ProductFilter productFilter = new ProductFilter(null, productName, null, null, null);
        response = quantumStockHttpClient.getAllProducts(productFilter);
    }

    @And("the product names should be:")
    public void theProductNamesShouldBe(DataTable dataTable) {
        String responseBody = response.getBody();
        ObjectMapper objectMapper = new ObjectMapper();
        List<String> productNames = dataTable.asList(String.class);

        try {
            PaginatedResponse<Product> paginatedResponse = objectMapper.readValue(
                    responseBody,
                    objectMapper.getTypeFactory().constructParametricType(
                            PaginatedResponse.class,
                            Product.class
                    )
            );
            List<Product> products = paginatedResponse.getContent();

            productNames.forEach(expectedName -> {
                boolean found = products.stream().anyMatch(product -> product.getName().equals(expectedName));
                assertThat(found).isTrue();
            });
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse response body", e);
        }
    }

    @When("I send a GET request to retrieve products with category {string}")
    public void iSendAGETRequestToRetrieveProductsWithCategory(String category) {
        ProductFilter productFilter = new ProductFilter(null, null, category, null, null);
        response = quantumStockHttpClient.getAllProducts(productFilter);
    }

    @When("I send a GET request to retrieve products with minPrice {string}")
    public void iSendAGETRequestToRetrieveProductsWithMinPrice(String minPrice) {
    ProductFilter productFilter = new ProductFilter(null, null, null, new BigDecimal(minPrice), null);
        response = quantumStockHttpClient.getAllProducts(productFilter);
    }

    @When("I send a GET request to retrieve products with maxPrice {string}")
    public void iSendAGETRequestToRetrieveProductsWithMaxPrice(String maxPrice) {
        ProductFilter productFilter = new ProductFilter(null, null, null, null, new BigDecimal(maxPrice));
        response = quantumStockHttpClient.getAllProducts(productFilter);
    }

    @When("I send a GET request to retrieve products with parameters:")
    public void iSendAGETRequestToRetrieveProductsWithParameters(DataTable productFilterData) {
        List<List<String>> rows = productFilterData.asLists(String.class);
        String name = null;
        String category = null;
        BigDecimal minPrice = null;
        BigDecimal maxPrice = null;

        for (List<String> row : rows) {
            switch (row.get(0)) {
                case "name":
                    name = row.get(1);
                    break;
                case "category":
                    category = row.get(1);
                    break;
                case "minPrice":
                    minPrice = new BigDecimal(row.get(1));
                    break;
                case "maxPrice":
                    maxPrice = new BigDecimal(row.get(1));
                    break;
            }
        }

        ProductFilter productFilter = new ProductFilter(null, name, category, minPrice, maxPrice);
        response = quantumStockHttpClient.getAllProducts(productFilter);
    }

    @And("all products should have price greater than or equal to {int}")
    public void allProductsShouldHavePriceGreaterThanOrEqualTo(int minPrice) {
        String responseBody = response.getBody();
        ObjectMapper objectMapper = new ObjectMapper();

        try {
            PaginatedResponse<Product> paginatedResponse = objectMapper.readValue(
                    responseBody,
                    objectMapper.getTypeFactory().constructParametricType(
                            PaginatedResponse.class,
                            Product.class
                    )
            );

            List<Product> productList = paginatedResponse.getContent();
            productList.forEach(product -> assertThat(product.getPrice()).isGreaterThanOrEqualTo(BigDecimal.valueOf(minPrice)));
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse response body", e);
        }
    }

    @And("all products should have category {string}")
    public void allProductsShouldHaveCategory(String category) {
        String responseBody = response.getBody();
        ObjectMapper objectMapper = new ObjectMapper();

        try {
            PaginatedResponse<Product> paginatedResponse = objectMapper.readValue(
                    responseBody,
                    objectMapper.getTypeFactory().constructParametricType(
                            PaginatedResponse.class,
                            Product.class
                    )
            );
            List<Product> productList = paginatedResponse.getContent();
            productList.forEach(product -> assertThat(product.getCategory()).isEqualTo(Category.valueOf(category)));
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse response body", e);
        }
    }
}
