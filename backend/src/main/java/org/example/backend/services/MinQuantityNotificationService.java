package org.example.backend.services;

import lombok.AllArgsConstructor;
import org.example.backend.models.MinQuantityNotification;
import org.example.backend.repositories.MinQuantityNotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

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

    public MinQuantityNotification getNotificationById(Long id) {
        return minQuantityNotificationRepository.findById(id).orElse(null);
    }

    public List<MinQuantityNotification> getAllNotifications() {
        return minQuantityNotificationRepository.findAll();
    }
}
