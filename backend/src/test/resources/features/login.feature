Feature: Login
    Scenario: Successful login
        When I send a POST request to login endpoint with username "admin" and password "admin"
        Then the response status code should be 200
        And the response should contain a token

    Scenario: Unsuccessful login with invalid credentials
        When I send a POST request to login endpoint with username "invalid" and password "invalid"
        Then the response status code should be 401
        And the response should a property "message" with value "Invalid credentials"

    Scenario: Unsuccessful login with missing credentials
        When I send a POST request to login endpoint without username and password
        Then the response status code should be 400
