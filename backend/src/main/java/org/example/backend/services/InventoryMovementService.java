package org.example.backend.services;

import lombok.AllArgsConstructor;
import org.example.backend.models.InventoryMovement;
import org.example.backend.repositories.InventoryMovementRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;


@Service
@AllArgsConstructor
public class InventoryMovementService {
    private final InventoryMovementRepository inventoryMovementRepository;

    public InventoryMovement create(InventoryMovement inventoryMovement) {
        return inventoryMovementRepository.save(inventoryMovement);
    }

    public Page<InventoryMovement> getAllInventoryMovements(Pageable pageable) {
        return inventoryMovementRepository.findAll(pageable);
    }
}
