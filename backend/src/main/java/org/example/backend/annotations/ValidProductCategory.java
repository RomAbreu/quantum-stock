package org.example.backend.annotations;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import org.example.backend.enums.Category;
import org.example.backend.validators.CategoryValidator;

import java.lang.annotation.*;

@Target(ElementType.FIELD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Constraint(validatedBy = CategoryValidator.class)
public @interface ValidProductCategory {
    Category[] anyOf();
    String message() default "Product category must be any of {anyOf}";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
