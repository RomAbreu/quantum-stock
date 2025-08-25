package org.example.backend.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.AllArgsConstructor;
import org.example.backend.dtos.MinQuantityNotificationResponse;
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
    private final ObjectMapper objectMapper;

    @GetMapping
    public ResponseEntity<List<MinQuantityNotificationResponse>> getAllNotifications() {
        List<MinQuantityNotification> notifications = minQuantityNotificationService.getAllNotifications();

        List<MinQuantityNotificationResponse> notificationResponses = notifications.stream()
                .map(notification -> objectMapper.convertValue(notification, MinQuantityNotificationResponse.class))
                .toList();

        return ResponseEntity.ok(notificationResponses);
    }
}
