package org.example.backend.services;

import org.example.backend.dtos.ProductFilter;
import org.example.backend.enums.Category;
import org.example.backend.enums.InventoryMovementType;
import org.example.backend.models.InventoryMovement;
import org.example.backend.models.MinQuantityNotification;
import org.example.backend.models.Product;
import org.example.backend.repositories.ProductRepository;
import org.example.backend.specifications.ProductSpecifications;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockedStatic;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private InventoryMovementService inventoryMovementService;

    @Mock
    private MinQuantityNotificationService minQuantityNotificationService;

    @InjectMocks
    private ProductService productService;

    private Product product1;
    private Product product2;
    private Product lowQuantityProduct;

    private InventoryMovement invMovement1;

    List<Product> products;


    @BeforeEach
    void setUp() {
        product1 = new Product(1L, "Product 1", "Description 1", Category.ELECTRONICS, new BigDecimal("100.00"), 10, 5, true);
        product2 = new Product(2L, "Product 2", "Description 2", Category.CLOTHING, new BigDecimal("50.00"), 20, 10, true);
        lowQuantityProduct = new Product(3L, "Low Quantity Product", "Description 3", Category.FOOD, new BigDecimal("5.00"), 2, 10, true);

        invMovement1 = new InventoryMovement(1L, product1, 10, InventoryMovementType.IN, "admin", LocalDateTime.now());

        products = List.of(product1, product2, lowQuantityProduct);
    }

    @Test
    void testGetAllProducts_ShouldReturnPageOfProducts() {
        ProductFilter filters = new ProductFilter(null, null, null, null, null);
        Pageable pageable = PageRequest.of(0, 10);
        Page<Product> expectedPage = new PageImpl<>(products, pageable, 3);
        Specification<Product> mockSpec = mock(Specification.class);

        try (MockedStatic<ProductSpecifications> mockedSpecs = mockStatic(ProductSpecifications.class)) {

            mockedSpecs.when(() -> ProductSpecifications.buildSpecification(filters))
                    .thenReturn(mockSpec);

            when(productRepository.findAll(mockSpec, pageable)).thenReturn(expectedPage);

            Page<Product> result = productService.getAllProducts(filters, pageable);

            assertNotNull(result);
            assertEquals(expectedPage, result);
            assertEquals(3, result.getContent().size());
            assertEquals(product1, result.getContent().get(0));
            assertEquals(product2, result.getContent().get(1));
            assertEquals(lowQuantityProduct, result.getContent().get(2));
        }
    }

    @Test
    void testGetAllProducts_WithEmptyPage_ShouldReturnEmptyPage() {
        ProductFilter filters = new ProductFilter(null, null, null, null, null);
        Pageable pageable = PageRequest.of(0, 10);
        Page<Product> emptyPage = new PageImpl<>(List.of(), pageable, 0);
        Specification<Product> mockSpec = mock(Specification.class);

        try (MockedStatic<ProductSpecifications> mockedSpecs = mockStatic(ProductSpecifications.class)) {
            mockedSpecs.when(() -> ProductSpecifications.buildSpecification(filters))
                    .thenReturn(mockSpec);
            when(productRepository.findAll(mockSpec, pageable)).thenReturn(emptyPage);

            Page<Product> result = productService.getAllProducts(filters, pageable);

            assertNotNull(result);
            assertTrue(result.getContent().isEmpty());
        }
    }

    @Test
    void testCreate_ShouldCreateProductAndLogInventoryMovement() {
        when(productRepository.save(any(Product.class))).thenReturn(product1);
        when(inventoryMovementService.create(any(InventoryMovement.class))).thenReturn(invMovement1);

        Product result = productService.create(product1, "admin");

        assertNotNull(result);
        assertEquals(product1, result);
        verify(productRepository).save(product1);
        verify(inventoryMovementService).create(any(InventoryMovement.class));
    }

    @Test
    void testCreate_WithLowQuantity_ShouldCreateNotification() {
        when(productRepository.save(any(Product.class))).thenReturn(lowQuantityProduct);
        doNothing().when(minQuantityNotificationService).saveNotification(any(MinQuantityNotification.class));

        Product result = productService.create(lowQuantityProduct, "admin");

        assertNotNull(result);
        assertEquals(lowQuantityProduct, result);
        verify(minQuantityNotificationService).saveNotification(any(MinQuantityNotification.class));
    }

    @Test
    void testUpdate_ShouldUpdateProductSuccessfully() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product1));
        when(productRepository.save(any(Product.class))).thenReturn(product2);

        Product result = productService.update(1L, product2, "admin");

        assertNotNull(result);
        assertEquals(product2, result);
        assertEquals(1L, result.getId());
        verify(productRepository).findById(1L);
        verify(productRepository).save(product2);
    }

    @Test
    void testUpdate_WithProductNotFound_ShouldReturnNull() {
        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        Product result = productService.update(1L, product2, "admin");

        assertNull(result);
        verify(productRepository).findById(1L);
        verify(productRepository, never()).save(any(Product.class));
        verify(inventoryMovementService, never()).create(any(InventoryMovement.class));
    }

    @Test
    void testUpdate_WithInactiveProduct_ShouldReturnNull() {
        product1.setActive(false);
        when(productRepository.findById(1L)).thenReturn(Optional.of(product1));

        Product result = productService.update(1L, product2, "admin");

        assertNull(result);
        verify(productRepository).findById(1L);
        verify(productRepository, never()).save(any(Product.class));
        verify(inventoryMovementService, never()).create(any(InventoryMovement.class));
    }

    @Test
    void testUpdate_WithQuantityIncrease_ShouldLogInventoryMovement() {
        // Arrange
        Product increasedQuantityProduct = Product.builder()
                .id(1L)
                .name("Product 1")
                .description("Description 1")
                .category(Category.ELECTRONICS)
                .price(new BigDecimal("99.99"))
                .quantity(20)
                .minQuantity(5)
                .isActive(true)
                .build();

        when(productRepository.findById(1L)).thenReturn(Optional.of(product1));
        when(productRepository.save(any(Product.class))).thenReturn(increasedQuantityProduct);
        when(inventoryMovementService.create(any(InventoryMovement.class)))
                .thenReturn(new InventoryMovement(1L, increasedQuantityProduct, 20, InventoryMovementType.IN, "admin", LocalDateTime.now()));

        Product result = productService.update(1L, increasedQuantityProduct, "admin");

        assertNotNull(result);
        verify(inventoryMovementService).create(any(InventoryMovement.class));
    }

    @Test
    void testUpdate_WithQuantityDecrease_ShouldLogInventoryMovement() {
        // Arrange
        Product decreasedQuantityProduct = Product.builder()
                .id(1L)
                .name("Product 1")
                .description("Description 1")
                .category(Category.ELECTRONICS)
                .price(new BigDecimal("99.99"))
                .quantity(5)
                .minQuantity(5)
                .isActive(true)
                .build();

        when(productRepository.findById(1L)).thenReturn(Optional.of(product1));
        when(productRepository.save(any(Product.class))).thenReturn(decreasedQuantityProduct);
        when(inventoryMovementService.create(any(InventoryMovement.class)))
                .thenReturn(new InventoryMovement(1L, decreasedQuantityProduct, 5, InventoryMovementType.OUT, "admin", LocalDateTime.now()));

        Product result = productService.update(1L, decreasedQuantityProduct, "admin");

        assertNotNull(result);
        verify(inventoryMovementService).create(any(InventoryMovement.class));
    }

    @Test
    void testUpdate_WithSameQuantity_ShouldNotLogInventoryMovement() {
        Product sameQuantityProduct = Product.builder()
                .id(1L)
                .name("Product 1")
                .description("Description 1")
                .category(Category.ELECTRONICS)
                .price(new BigDecimal("99.99"))
                .quantity(10)
                .minQuantity(5)
                .isActive(true)
                .build();

        when(productRepository.findById(1L)).thenReturn(Optional.of(product1));
        when(productRepository.save(any(Product.class))).thenReturn(sameQuantityProduct);

        Product result = productService.update(1L, sameQuantityProduct, "admin");

        assertNotNull(result);
        verify(inventoryMovementService, never()).create(any(InventoryMovement.class));
    }

    @Test
    void testDelete_ShouldDeactivateProductSuccessfully() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(product1));
        when(productRepository.save(any(Product.class))).thenReturn(product1);
        doNothing().when(minQuantityNotificationService).deleteNotificationByProductId(1L);

        Product result = productService.delete(1L);

        assertNotNull(result);
        assertFalse(result.isActive());
        verify(productRepository).findById(1L);
        verify(productRepository).save(product1);
        verify(minQuantityNotificationService).deleteNotificationByProductId(1L);
    }

    @Test
    void testDelete_WithProductNotFound_ShouldReturnNull() {
        when(productRepository.findById(1L)).thenReturn(Optional.empty());

        Product result = productService.delete(1L);

        assertNull(result);
        verify(productRepository).findById(1L);
        verify(productRepository, never()).save(any(Product.class));
        verify(minQuantityNotificationService, never()).deleteNotificationByProductId(anyLong());
    }

    @Test
    void testDelete_WithInactiveProduct_ShouldReturnNull() {
        product1.setActive(false);
        when(productRepository.findById(1L)).thenReturn(Optional.of(product1));

        Product result = productService.delete(1L);

        assertNull(result);
        verify(productRepository).findById(1L);
        verify(productRepository, never()).save(any(Product.class));
        verify(minQuantityNotificationService, never()).deleteNotificationByProductId(anyLong());
    }

    @Test
    void testDelete_WithExistingNotification_ShouldDeleteNotification() {
        // Arrange
        MinQuantityNotification existingNotification = MinQuantityNotification.builder()
                .id(1L)
                .product(product1)
                .notificationDate(LocalDateTime.now())
                .build();

        when(productRepository.findById(1L)).thenReturn(Optional.of(product1));
        when(productRepository.save(any(Product.class))).thenReturn(product1);
        doNothing().when(minQuantityNotificationService).deleteNotificationByProductId(1L);

        // Act
        Product result = productService.delete(1L);

        // Assert
        assertNotNull(result);
        verify(minQuantityNotificationService).deleteNotificationByProductId(1L);
    }

    @Test
    void testHandleMinQuantityNotification_WithLowQuantity_ShouldCreateNotification() {
        when(productRepository.save(any(Product.class))).thenReturn(lowQuantityProduct);
        doNothing().when(minQuantityNotificationService).saveNotification(any(MinQuantityNotification.class));

        productService.create(lowQuantityProduct, "admin");

        verify(minQuantityNotificationService).saveNotification(any(MinQuantityNotification.class));
    }
}
