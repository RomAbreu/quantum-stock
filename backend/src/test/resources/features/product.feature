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

  Scenario: Delete an existing product
    Given I am an authenticated admin user with credentials "admin" and "admin"
    When I send a DELETE request to delete product endpoint with product ID 1
    Then the response status code should be 200

  Scenario: Create multiple products
    Given I am an authenticated admin user with credentials "admin" and "admin"
    When I send a POST request to create product endpoint with the following products data:
      | name                | description              | price  | category    | quantity | minQuantity |
      | iPhone 15           | Latest Apple smartphone  | 999.99 | ELECTRONICS | 50       | 10          |
      | Samsung Galaxy S24  | Android flagship phone   | 899.99 | ELECTRONICS | 30       | 5           |
      | Nike Air Max        | Comfortable running shoes| 129.99 | CLOTHING    | 100      | 20          |
      | Adidas Ultraboost   | Premium running sneakers | 179.99 | CLOTHING    | 75       | 15          |
      | Coffee Maker        | Automatic drip coffee    | 89.99  | HOME        | 25       | 5           |
      | Blender Pro         | High-power kitchen blend | 199.99 | HOME        | 40       | 8           |
      | Protein Powder      | Whey protein supplement  | 49.99  | HEALTH      | 200      | 50          |
      | Yoga Mat            | Non-slip exercise mat    | 29.99  | SPORTS      | 150      | 30          |

  Scenario: Get all products without filters
    When I send a GET request to retrieve all products without filters
    Then the response status code should be 200
    And the response should contain 8 products

  Scenario: Filter products by name
    When I send a GET request to retrieve products with name "iPhone 15"
    Then the response status code should be 200
    And the response should contain 1 products
    And the product names should be:
        | iPhone 15 |

  Scenario: Filter products by category
    When I send a GET request to retrieve products with category "CLOTHING"
    Then the response status code should be 200
    And the response should contain 2 products
    And the product names should be:
        | Nike Air Max        |
        | Adidas Ultraboost   |

  Scenario: Filter products by price range
    When I send a GET request to retrieve products with minPrice "100.00"
    Then the response status code should be 200
    And the response should contain 5 products
    And the product names should be:
        | iPhone 15           |
        | Samsung Galaxy S24  |
        | Nike Air Max        |
        | Adidas Ultraboost   |
        | Blender Pro         |

  Scenario: Filter products by price range
    When I send a GET request to retrieve products with maxPrice "100.00"
    Then the response status code should be 200
    And the response should contain 3 products
    And the product names should be:
        | Coffee Maker        |
        | Yoga Mat            |
        | Protein Powder      |

  Scenario: Filter products by multiple criteria
    When I send a GET request to retrieve products with parameters:
      | category  | ELECTRONICS |
      | minPrice  | 800         |
    Then the response status code should be 200
    And the response should contain 2 products
    And all products should have category "ELECTRONICS"
    And all products should have price greater than or equal to 800