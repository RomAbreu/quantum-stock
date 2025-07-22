package org.example.backend.models;

import jakarta.persistence.*;
import lombok.*;
import org.example.backend.enums.InventoryMovementType;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "inventory_movement")
public class InventoryMovement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(nullable = false)
    private Product product;

    @Column(nullable = false)
    private int quantityChange;

    @Enumerated(EnumType.STRING)
    private InventoryMovementType type;

    @Column(nullable = false)
    private String user;

    @Column(nullable = false)
    private LocalDateTime date;

    @PrePersist
    private void prePersist() {
        this.date = LocalDateTime.now();
    }
}
