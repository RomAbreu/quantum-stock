package org.example.backend.services;

import org.example.backend.dtos.ProductFilter;
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

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Page<Product> getAllProducts(ProductFilter filters, Pageable pageable) {
        Specification<Product> spec = buildSpecification(filters);
        return productRepository.findAll(spec, pageable);
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
