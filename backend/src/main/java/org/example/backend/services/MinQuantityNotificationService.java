package org.example.backend.services;

import lombok.AllArgsConstructor;
import org.example.backend.models.MinQuantityNotification;
import org.example.backend.repositories.MinQuantityNotificationRepository;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class MinQuantityNotificationService {
    private final MinQuantityNotificationRepository minQuantityNotificationRepository;

    public void deleteNotificationByProductId(Long productId) {
        minQuantityNotificationRepository.deleteById(productId);
    }

    public void saveNotification(MinQuantityNotification notification) {
        minQuantityNotificationRepository.save(notification);
    }
}
