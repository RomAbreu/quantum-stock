package org.example.backend.services;

import lombok.AllArgsConstructor;
import org.example.backend.dtos.ProductFilter;
import org.example.backend.enums.InventoryMovementType;
import org.example.backend.models.InventoryMovement;
import org.example.backend.models.MinQuantityNotification;
import org.example.backend.models.Product;
import org.example.backend.repositories.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import static org.example.backend.specifications.ProductSpecifications.buildSpecification;

@Service
@AllArgsConstructor
public class ProductService {
    private final ProductRepository productRepository;
    private final InventoryMovementService inventoryMovementService;
    private final MinQuantityNotificationService minQuantityNotificationService;

    public Page<Product> getAllProducts(ProductFilter filters, Pageable pageable) {
        Specification<Product> spec = buildSpecification(filters);
        return productRepository.findAll(spec, pageable);
    }

    public Product create(Product product, String user) {
        Product productCreated = productRepository.save(product);
        logInventoryMovement(productCreated, productCreated.getQuantity(), InventoryMovementType.IN, user);
        handleMinQuantityNotification(productCreated, false);
        return productCreated;
    }

    public Product update(Long id, Product newProduct, String user) {
        Product oldProduct = productRepository.findById(id).orElse(null);

        if (oldProduct == null || !oldProduct.isActive())
            return null;

        int previousQuantity = oldProduct.getQuantity();
        newProduct.setId(id);
        productRepository.save(newProduct);

        if (previousQuantity != newProduct.getQuantity()) {
            int quantityChange = newProduct.getQuantity() - oldProduct.getQuantity();
            InventoryMovementType type = quantityChange > 0 ? InventoryMovementType.IN : InventoryMovementType.OUT;
            logInventoryMovement(newProduct, newProduct.getQuantity(), type, user);
        }

        handleMinQuantityNotification(newProduct, false);

        return newProduct;
    }

    public Product delete(Long id) {
        Product product = productRepository.findById(id).orElse(null);

        if (product == null)
            return null;

        product.setActive(false);
        productRepository.save(product);
        handleMinQuantityNotification(product, true);
        return product;
    }

    private void logInventoryMovement(Product product, int quantityChange, InventoryMovementType type, String user) {
        InventoryMovement inventoryMovement = InventoryMovement.builder()
                .product(product)
                .quantityChange(quantityChange)
                .type(type)
                .user(user)
                .build();
        inventoryMovementService.create(inventoryMovement);
    }

    private void handleMinQuantityNotification(Product product, boolean isProductBeingDeleted) {
        MinQuantityNotification existingNotification = minQuantityNotificationService.getNotificationById(product.getId());
        if (existingNotification != null && isProductBeingDeleted) {
            minQuantityNotificationService.deleteNotificationByProductId(product.getId());
            return;
        }

        if (product.getQuantity() < product.getMinQuantity()) {
            MinQuantityNotification notification = MinQuantityNotification.builder()
                    .id(product.getId())
                    .product(product)
                    .notificationDate(LocalDateTime.now())
                    .build();
            minQuantityNotificationService.saveNotification(notification);
        } else {
            minQuantityNotificationService.deleteNotificationByProductId(product.getId());
        }
    }
}
