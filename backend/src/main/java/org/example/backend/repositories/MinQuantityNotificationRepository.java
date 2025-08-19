package org.example.backend.repositories;

import org.example.backend.models.MinQuantityNotification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MinQuantityNotificationRepository extends JpaRepository<MinQuantityNotification, Long> {
}
