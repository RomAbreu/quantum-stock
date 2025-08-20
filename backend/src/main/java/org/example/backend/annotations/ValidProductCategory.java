package org.example.backend.annotations;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import org.example.backend.enums.Category;

import java.lang.annotation.*;

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Constraint(validatedBy = CategoryValidator.class)
public @interface ValidProductCategory {
    Category[] anyOf() default {Category.BOOKS, Category.ELECTRONICS, Category.CLOTHING,Category.FOOD,
                                Category.TOYS, Category.HOME, Category.HEALTH, Category.SPORTS,
                                Category.PET_SUPPLIES, Category.AUTOMOTIVE};
    String message() default "Product category must be any of {anyOf}";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
