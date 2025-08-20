package org.example.backend.controllers;

import lombok.AllArgsConstructor;
import org.example.backend.models.MinQuantityNotification;
import org.example.backend.services.MinQuantityNotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/min-quantity-notifications")
@AllArgsConstructor
public class MinQuantityNotificationController {
    private final MinQuantityNotificationService minQuantityNotificationService;

    @GetMapping
    public ResponseEntity<List<MinQuantityNotification>> getAllNotifications() {
        List<MinQuantityNotification> notifications = minQuantityNotificationService.getAllNotifications();
        return ResponseEntity.ok(notifications);
    }
}
