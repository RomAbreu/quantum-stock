package org.example.backend.services;

import org.example.backend.dtos.ProductFilter;
import org.example.backend.models.Product;
import org.example.backend.repositories.ProductRepository;
import org.example.backend.specifications.ProductSpecifications;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProductService {
    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts(ProductFilter filters, Pageable pageable) {
        Specification<Product> spec = buildSpecification(filters);
        return productRepository.findAll(spec, pageable).getContent();
    }

    private Specification<Product> buildSpecification(ProductFilter filters) {
        List<Specification<Product>> specs = new ArrayList<>();

        if (filters.id() != null) {
            specs.add(ProductSpecifications.hasId(filters.id()));
        }

        if (filters.name() != null && !filters.name().isEmpty()) {
            specs.add(ProductSpecifications.hasName(filters.name()));
        }

        if (filters.category() != null && !filters.category().isEmpty()) {
            specs.add(ProductSpecifications.hasCategory(filters.category()));
        }

        if (filters.minPrice() != null || filters.maxPrice() != null) {
            specs.add(ProductSpecifications.hasPriceBetween(filters.minPrice(), filters.maxPrice()));
        }

        return specs.isEmpty()
                ? null
                : Specification.allOf(specs);
    }

    public Product create(Product product) {
        return productRepository.save(product);
    }

    public Product update(Long id, Product productDetails) {
        Product product = productRepository.findById(id).orElse(null);
        if (product != null) {
            product.setName(productDetails.getName());
            product.setDescription(productDetails.getDescription());
            product.setCategory(productDetails.getCategory());
            product.setPrice(productDetails.getPrice());
            product.setQuantity(productDetails.getQuantity());
            product.setMinQuantity(productDetails.getMinQuantity());
            return productRepository.save(product);
        }
        return null;
    }

    public Product delete(Long id) {
        Product product = productRepository.findById(id).orElse(null);
        if (product != null) {
            productRepository.delete(product);
            return product;
        }
        return null;
    }
}
