package org.example.backend.dtos;

import java.time.LocalDateTime;

public record MinQuantityNotificationResponse(
        Long id,
        ProductResponse product,
        LocalDateTime notificationDate
) {
}
