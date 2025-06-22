package org.example.backend.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.example.backend.annotations.ValidProductCategory;
import org.example.backend.enums.Category;
import org.springframework.data.annotation.Id;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "product")
public class Product {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Product name is required")
    @Size(min = 1, max = 100, message = "Product name must be between 1 and 50 characters")
    private String name;

    @NotBlank(message = "Product description is required")
    @Size(max = 150, message = "Product description must be less than 150 characters")
    private String description;

    @NotBlank(message = "Product category is required")
    @ValidProductCategory(anyOf = {Category.ELECTRONICS, Category.CLOTHING, Category.HOME, Category.HEALTH,
                                    Category.TOYS, Category.SPORTS, Category.BOOKS,
                                    Category.FOOD, Category.PET_SUPPLIES, Category.AUTOMOTIVE})
    private String category;

    @NotBlank(message = "Product price is required")
    @DecimalMin(value = "0.0", message = "Product price must be greater than or equal to 0.0")
    private double price;

    @NotBlank(message = "Product quantity is required")
    @Min(value = 0, message = "Product quantity must be greater than or equal to 0")
    private int quantity;

    @NotBlank(message = "Product minimum quantity is required")
    @Min(value = 1, message = "Product minimum quantity must be greater than or equal to 1")
    private int minQuantity;
}
