package org.example.backend.specifications;

import jakarta.persistence.criteria.Predicate;
import org.example.backend.dtos.ProductFilter;
import org.example.backend.models.Product;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class ProductSpecifications {

    public static Specification<Product> buildSpecification(ProductFilter filters) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filters.id() != null) {
                predicates.add(cb.equal(root.get("id"), filters.id()));
            }

            if (filters.name() != null && !filters.name().isEmpty()) {
                predicates.add(
                        cb.like(
                                cb.lower(root.get("name")),
                                "%" + filters.name().toLowerCase() + "%"
                        )
                );
            }

            if (filters.category() != null && !filters.category().isEmpty()) {
                predicates.add(
                        cb.equal(
                                cb.lower(root.get("category")),
                                filters.category().toLowerCase()
                        )
                );
            }

            if (filters.minPrice() != null && filters.maxPrice() != null) {
                predicates.add(cb.between(root.get("price"), filters.minPrice(), filters.maxPrice()));
            } else if (filters.minPrice() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), filters.minPrice()));
            } else if (filters.maxPrice() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), filters.maxPrice()));
            }

            if (predicates.isEmpty()) {
                return cb.conjunction();
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}

