package org.example.backend.services;

import org.example.backend.dtos.ProductFilter;
import org.example.backend.enums.InventoryMovementType;
import org.example.backend.models.InventoryMovement;
import org.example.backend.models.Product;
import org.example.backend.repositories.ProductRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import static org.example.backend.specifications.ProductSpecifications.buildSpecification;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private final InventoryMovementService inventoryMovementService;

    public ProductService(ProductRepository productRepository,
                          InventoryMovementService inventoryMovementService) {
        this.productRepository = productRepository;
        this.inventoryMovementService = inventoryMovementService;
    }

    public Page<Product> getAllProducts(ProductFilter filters, Pageable pageable) {
        Specification<Product> spec = buildSpecification(filters);
        return productRepository.findAll(spec, pageable);
    }

    public Product create(Product product, String user) {
        Product productCreated = productRepository.save(product);
        logInventoryMovement(productCreated, productCreated.getQuantity(), InventoryMovementType.IN, user);
        return productCreated;
    }

    public Product update(Long id, Product newProduct, String user) {
        Product oldProduct = productRepository.findById(id).orElse(null);

        if (oldProduct == null)
            return null;

        productRepository.save(newProduct);

        if (oldProduct.getQuantity() != newProduct.getQuantity()) {
            int quantityChange = newProduct.getQuantity() - oldProduct.getQuantity();
            InventoryMovementType type = quantityChange > 0 ? InventoryMovementType.IN : InventoryMovementType.OUT;
            logInventoryMovement(newProduct, newProduct.getQuantity(), type, user);
        }

        return newProduct;
    }

    public Product delete(Long id) {
        Product product = productRepository.findById(id).orElse(null);

        if (product == null)
            return null;

        productRepository.delete(product);
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
}
