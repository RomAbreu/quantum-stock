package org.example.backend.dtos;

import java.math.BigDecimal;

public record ProductResponse (
        Long id,
        String name,
        String description,
        String category,
        BigDecimal price,
        int quantity,
        int minQuantity
) {
}
