package org.example.backend.validators;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.example.backend.annotations.ValidProductCategory;
import org.example.backend.enums.Category;

import java.util.Arrays;

public class CategoryValidator implements ConstraintValidator<ValidProductCategory, String> {

    private Category[] categories;

    @Override
    public void initialize(ValidProductCategory constraintAnnotation) {
        this.categories = constraintAnnotation.anyOf();
    }

    @Override
    public boolean isValid(String s, ConstraintValidatorContext constraintValidatorContext) {
        if (s == null || s.isBlank()) {
            return false;
        }

        // Check if the provided category is in the allowed categories
        return Arrays.stream(categories)
                .anyMatch(category -> category.name().equalsIgnoreCase(s));
    }


}
