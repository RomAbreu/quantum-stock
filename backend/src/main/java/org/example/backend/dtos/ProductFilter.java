package org.example.backend.dtos;

import java.math.BigDecimal;

public record ProductFilter(Long id, String name, String category, BigDecimal minPrice, BigDecimal maxPrice) {
}
