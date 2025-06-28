package org.example.backend.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.backend.dtos.ProductFilter;
import org.example.backend.models.Product;
import org.example.backend.services.ProductService;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {
    private final ProductService productService;

    @GetMapping("/all")
    public ResponseEntity<List<Product>> getAllProducts(ProductFilter filters, Pageable pageable) {
        return ResponseEntity.ok(productService.getAllProducts(filters, pageable));
    }

    @PostMapping("/create")
    public ResponseEntity<Product> create(@RequestBody @Valid Product product) {
        return ResponseEntity.ok(productService.create(product));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Product> update(@PathVariable Long id, @RequestBody @Valid Product productDetails) {
        Product updatedProduct = productService.update(id, productDetails);
        if (updatedProduct != null) {
            return ResponseEntity.ok(updatedProduct);
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Product> delete(@PathVariable Long id) {
        Product deletedProduct = productService.delete(id);
        if (deletedProduct != null) {
            return ResponseEntity.ok(deletedProduct);
        }
        return ResponseEntity.notFound().build();
    }
}
