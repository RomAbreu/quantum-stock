package org.example.backend.dtos;

import jakarta.validation.constraints.*;
import org.example.backend.annotations.ValidProductCategory;

import java.math.BigDecimal;

public record ProductRequest(
        @NotNull(message = "Product name is required")
        @Size(min = 1, max = 100, message = "Product name must be between 1 and 100 characters")
        String name,

        @NotNull(message = "Product description is required")
        @Size(max = 250, message = "Product description must be less than 250 characters")
        String description,

        @NotNull(message = "Product category is required")
        @ValidProductCategory
        String category,

        @NotNull(message = "Product price is required")
        @DecimalMin(value = "0.0", message = "Product price must be greater than or equal to 0.0")
        BigDecimal price,

        @NotNull(message = "Product quantity is required")
        @Min(value = 0, message = "Product quantity must be greater than or equal to 0")
        int quantity,

        @NotNull(message = "Product minimum quantity is required")
        @Min(value = 0, message = "Product minimum quantity must be greater than or equal to 0")
        int minQuantity
) {
}
