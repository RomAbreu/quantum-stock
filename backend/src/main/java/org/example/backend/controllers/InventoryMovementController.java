package org.example.backend.controllers;

import lombok.RequiredArgsConstructor;
import org.example.backend.models.InventoryMovement;
import org.example.backend.services.InventoryMovementService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/inventory-movements")
@RequiredArgsConstructor
public class InventoryMovementController {
    private final InventoryMovementService inventoryMovementService;

    @GetMapping
    public ResponseEntity<List<InventoryMovement>> getAllInventoryMovements() {
        List<InventoryMovement> inventoryMovements = inventoryMovementService.getAllInventoryMovements();
        return ResponseEntity.ok(inventoryMovements);
    }
}
