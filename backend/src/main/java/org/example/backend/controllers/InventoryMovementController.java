package org.example.backend.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.example.backend.dtos.InventoryMovementResponse;
import org.example.backend.dtos.PaginatedResponse;
import org.example.backend.models.InventoryMovement;
import org.example.backend.services.InventoryMovementService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    private final ObjectMapper objectMapper;

    @GetMapping
    public ResponseEntity<PaginatedResponse<InventoryMovementResponse>> getAllInventoryMovements(Pageable pageable) {
        Page<InventoryMovement> inventoryMovements = inventoryMovementService.getAllInventoryMovements(pageable);

        List<InventoryMovementResponse> inventoryMovementResponses = inventoryMovements.stream()
                .map(movement -> objectMapper.convertValue(movement, InventoryMovementResponse.class))
                .toList();

        return ResponseEntity.ok(new PaginatedResponse<>(inventoryMovementResponses, inventoryMovements));
    }
}
