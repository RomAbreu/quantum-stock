package org.example.backend.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "min_quantity_notification")
public class MinQuantityNotification {
    @Id
    private Long id;

    @OneToOne
    @JoinColumn(nullable = false)
    private Product product;

    @Column(nullable = false)
    private LocalDateTime notificationDate;

    @PrePersist
    private void prePersist() {
        this.notificationDate = LocalDateTime.now();
    }

}
