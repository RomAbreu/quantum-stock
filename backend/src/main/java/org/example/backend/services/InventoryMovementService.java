package org.example.backend.services;

import lombok.AllArgsConstructor;
import org.example.backend.models.InventoryMovement;
import org.example.backend.repositories.InventoryMovementRepository;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@AllArgsConstructor
public class InventoryMovementService {
    private final InventoryMovementRepository inventoryMovementRepository;

    public InventoryMovement create(InventoryMovement inventoryMovement) {
        return inventoryMovementRepository.save(inventoryMovement);
    }

    public List<InventoryMovement> getAllInventoryMovements() {
        return inventoryMovementRepository.findAll();
    }
}
