package org.example.backend.dtos;

import org.example.backend.enums.InventoryMovementType;

import java.time.LocalDateTime;

public record InventoryMovementResponse(
        Long id,
        ProductResponse product,
        int quantityChange,
        InventoryMovementType type,
        String user,
        LocalDateTime date
) {
}
