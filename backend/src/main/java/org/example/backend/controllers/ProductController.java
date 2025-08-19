package org.example.backend.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.backend.dtos.PaginatedResponse;
import org.example.backend.dtos.ProductFilter;
import org.example.backend.dtos.ProductRequest;
import org.example.backend.dtos.ProductResponse;
import org.example.backend.models.Product;
import org.example.backend.services.ProductService;
import org.example.backend.util.Utils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {
    private final ObjectMapper objectMapper;
    private final ProductService productService;

    @GetMapping("/all")
    public ResponseEntity<PaginatedResponse<ProductResponse>> getAllProducts(ProductFilter filters, Pageable pageable) {
        Page<Product> products = productService.getAllProducts(filters, pageable);

        List<ProductResponse> productResponses = products.stream()
                .map(product -> objectMapper.convertValue(product, ProductResponse.class))
                .toList();

        return ResponseEntity.ok(new PaginatedResponse<>(productResponses, products));
    }

    @PostMapping("/create")
    public ResponseEntity<ProductResponse> create(@RequestBody @Valid ProductRequest productRequest,
                                                  @AuthenticationPrincipal Jwt jwt) {
        String user = Utils.extractUsernameFromJwt(jwt);
        Product product = objectMapper.convertValue(productRequest, Product.class);
        ProductResponse productResponse = objectMapper.convertValue(productService.create(product, user), ProductResponse.class);

        return ResponseEntity.ok(productResponse);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<ProductResponse> update(@PathVariable Long id,
                                                  @RequestBody @Valid ProductRequest productRequest,
                                                  @AuthenticationPrincipal Jwt jwt) {
        String user = Utils.extractUsernameFromJwt(jwt);
        Product productDetails = objectMapper.convertValue(productRequest, Product.class);
        Product updatedProduct = productService.update(id, productDetails, user);

        if (updatedProduct == null)
            return ResponseEntity.notFound().build();

        ProductResponse productResponse = objectMapper.convertValue(updatedProduct, ProductResponse.class);
        return ResponseEntity.ok(productResponse);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<ProductResponse> delete(@PathVariable Long id, @AuthenticationPrincipal Jwt jwt) {
        Product deletedProduct = productService.delete(id);

        if (deletedProduct == null)
            return ResponseEntity.notFound().build();

        ProductResponse productResponse = objectMapper.convertValue(deletedProduct, ProductResponse.class);
        return ResponseEntity.ok(productResponse);
    }
}
