Feature: Product Management
  Scenario: Create a new product
    Given I am an authenticated admin user with credentials "admin" and "admin"
    When I send a POST request to create product endpoint with the following product data:
        | name         | description                   | price   | category | quantity | minQuantity |
        | Baseball Bat | The best baseball bat ever!!! | 3500.00 | SPORTS   | 100      | 10          |
    Then the response status code should be 200

  Scenario: Create a new product with invalid price
    Given I am an authenticated admin user with credentials "admin" and "admin"
    When I send a POST request to create product endpoint with the following product data:
        | name         | description                   | price   | category | quantity | minQuantity |
        | Baseball Bat | The best baseball bat ever!!! | -3500.00| SPORTS   | 100      | 10          |
    Then the response status code should be 400
    And the response body should contain the error message "Product price must be greater than or equal to 0.0"

  Scenario: Create a new product with invalid quantity
    Given I am an authenticated admin user with credentials "admin" and "admin"
    When I send a POST request to create product endpoint with the following product data:
        | name         | description                   | price   | category | quantity | minQuantity |
        | Baseball Bat | The best baseball bat ever!!! | 3500.00 | SPORTS   | -100     | 10          |
    Then the response status code should be 400
    And the response body should contain the error message "Product quantity must be greater than or equal to 0"

  Scenario: Create a new product with invalid minQuantity
    Given I am an authenticated admin user with credentials "admin" and "admin"
    When I send a POST request to create product endpoint with the following product data:
        | name         | description                   | price   | category | quantity | minQuantity |
        | Baseball Bat | The best baseball bat ever!!! | 3500.00 | SPORTS   | 100      | -10         |
    Then the response status code should be 400
    And the response body should contain the error message "Product minimum quantity must be greater than or equal to 1"

  Scenario: Create a new product with invalid name
    Given I am an authenticated admin user with credentials "admin" and "admin"
    When I send a POST request to create product endpoint with the following product data:
        | name         | description                   | price   | category | quantity | minQuantity |
        |              | The best baseball bat ever!!! | 3500.00 | SPORTS   | 100      | 10          |
    Then the response status code should be 400
    And the response body should contain the error message "Product name is required"

  Scenario: Create a new product with invalid description
    Given I am an authenticated admin user with credentials "admin" and "admin"
    When I send a POST request to create product endpoint with the following product data:
        | name         | description | price   | category | quantity | minQuantity |
        | Baseball Bat |             | 3500.00 | SPORTS   | 100      | 10          |
    Then the response status code should be 400
    And the response body should contain the error message "Product description is required"

  Scenario: Create a new product with invalid category
    Given I am an authenticated admin user with credentials "admin" and "admin"
    When I send a POST request to create product endpoint with the following product data:
        | name         | description                   | price   | category | quantity | minQuantity |
        | Baseball Bat | The best baseball bat ever!!! | 3500.00 | MONEY    | 100      | 10          |
    Then the response status code should be 400
    And the response body should contain the error message "Product category must be any of [ELECTRONICS, CLOTHING, HOME, HEALTH, TOYS, SPORTS, BOOKS, FOOD, PET_SUPPLIES, AUTOMOTIVE]"

  Scenario: Update an existing product
    Given I am an authenticated admin user with credentials "admin" and "admin"
    When I send a PUT request to update product endpoint with the following product data:
        | id           | name         | description                   | price | category | quantity | minQuantity |
        | 1            | Potato Chips | The best potato chips ever!!! | 20.00 | FOOD     | 200      | 10          |
    Then the response status code should be 200