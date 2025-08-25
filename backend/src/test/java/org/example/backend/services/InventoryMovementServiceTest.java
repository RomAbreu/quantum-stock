package org.example.backend.services;

import org.example.backend.enums.Category;
import org.example.backend.enums.InventoryMovementType;
import org.example.backend.models.InventoryMovement;
import org.example.backend.models.Product;
import org.example.backend.repositories.InventoryMovementRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InventoryMovementServiceTest {

    @Mock
    private InventoryMovementRepository inventoryMovementRepository;

    @InjectMocks
    private InventoryMovementService inventoryMovementService;

    private Product testProduct;
    private Product product2;
    private Product product3;
    private InventoryMovement testInventoryMovement;

    @BeforeEach
    void setUp() {
        testProduct = Product.builder()
                .id(1L)
                .name("Test Product")
                .description("Test Description")
                .category(Category.ELECTRONICS)
                .price(new BigDecimal("99.99"))
                .quantity(10)
                .minQuantity(5)
                .isActive(true)
                .build();

        testInventoryMovement = InventoryMovement.builder()
                .id(1L)
                .product(testProduct)
                .quantityChange(5)
                .type(InventoryMovementType.IN)
                .user("testUser")
                .date(LocalDateTime.now())
                .build();

        product2 = Product.builder()
                .id(2L)
                .name("Product 2")
                .description("Description 2")
                .category(Category.CLOTHING)
                .price(new BigDecimal("49.99"))
                .quantity(20)
                .minQuantity(10)
                .isActive(true)
                .build();

        product3 = Product.builder()
                .id(3L)
                .name("Product 3")
                .description("Description 3")
                .category(Category.BOOKS)
                .price(new BigDecimal("29.99"))
                .quantity(15)
                .minQuantity(5)
                .isActive(true)
                .build();
    }

    @Test
    void testCreate_ShouldSaveAndReturnInventoryMovement() {
        when(inventoryMovementRepository.save(any(InventoryMovement.class)))
                .thenReturn(testInventoryMovement);

        InventoryMovement result = inventoryMovementService.create(testInventoryMovement);

        assertNotNull(result);
        assertEquals(testInventoryMovement, result);
        verify(inventoryMovementRepository).save(testInventoryMovement);
    }

    @Test
    void testCreate_WithNewInventoryMovement_ShouldSaveSuccessfully() {
        InventoryMovement newMovement = InventoryMovement.builder()
                .product(testProduct)
                .quantityChange(5)
                .type(InventoryMovementType.OUT)
                .user("admin")
                .build();

        when(inventoryMovementRepository.save(any(InventoryMovement.class)))
                .thenReturn(newMovement);

        InventoryMovement result = inventoryMovementService.create(newMovement);

        assertNotNull(result);
        assertEquals(newMovement, result);
        assertEquals(5, result.getQuantityChange());
        assertEquals(InventoryMovementType.OUT, result.getType());
        assertEquals("admin", result.getUser());
        verify(inventoryMovementRepository).save(newMovement);
    }

    @Test
    void testGetAllInventoryMovements_ShouldReturnPageOfMovements() {
        Pageable pageable = PageRequest.of(0, 10);
        List<InventoryMovement> movements = List.of(testInventoryMovement);
        Page<InventoryMovement> expectedPage = new PageImpl<>(movements, pageable, 1);
        
        when(inventoryMovementRepository.findAll(pageable)).thenReturn(expectedPage);

        Page<InventoryMovement> result = inventoryMovementService.getAllInventoryMovements(pageable);

        assertNotNull(result);
        assertEquals(expectedPage, result);
        assertEquals(1, result.getContent().size());
        assertEquals(testInventoryMovement, result.getContent().getFirst());
        verify(inventoryMovementRepository).findAll(pageable);
    }

    @Test
    void testGetAllInventoryMovements_WithEmptyPage_ShouldReturnEmptyPage() {
        Pageable pageable = PageRequest.of(0, 10);
        Page<InventoryMovement> emptyPage = new PageImpl<>(List.of(), pageable, 0);
        
        when(inventoryMovementRepository.findAll(pageable)).thenReturn(emptyPage);

        Page<InventoryMovement> result = inventoryMovementService.getAllInventoryMovements(pageable);

        assertNotNull(result);
        assertTrue(result.getContent().isEmpty());
        assertEquals(0, result.getTotalElements());
        verify(inventoryMovementRepository).findAll(pageable);
    }

    @Test
    void testCreateMultipleInventoryMovements_ShouldHandleAllCorrectly() {
        InventoryMovement movement2 = InventoryMovement.builder()
                .id(2L)
                .product(product2)
                .quantityChange(1)
                .type(InventoryMovementType.OUT)
                .user("user2")
                .date(LocalDateTime.now().plusHours(1))
                .build();

        InventoryMovement movement3 = InventoryMovement.builder()
                .id(3L)
                .product(product3)
                .quantityChange(20)
                .type(InventoryMovementType.IN)
                .user("user3")
                .date(LocalDateTime.now().plusHours(2))
                .build();

        when(inventoryMovementRepository.save(any(InventoryMovement.class)))
                .thenReturn(testInventoryMovement, movement2, movement3);

        InventoryMovement result1 = inventoryMovementService.create(testInventoryMovement);
        InventoryMovement result2 = inventoryMovementService.create(movement2);
        InventoryMovement result3 = inventoryMovementService.create(movement3);

        assertNotNull(result1);
        assertNotNull(result2);
        assertNotNull(result3);
        assertEquals(testInventoryMovement, result1);
        assertEquals(movement2, result2);
        assertEquals(movement3, result3);
        
        verify(inventoryMovementRepository, times(3)).save(any(InventoryMovement.class));
    }

    @Test
    void testGetAllInventoryMovements_WithMultipleProducts_ShouldReturnCorrectMovements() {
        Pageable pageable = PageRequest.of(0, 10);
        
        InventoryMovement movement2 = InventoryMovement.builder()
                .id(2L)
                .product(product2)
                .quantityChange(1)
                .type(InventoryMovementType.OUT)
                .user("user2")
                .date(LocalDateTime.now().plusHours(1))
                .build();

        InventoryMovement movement3 = InventoryMovement.builder()
                .id(3L)
                .product(product3)
                .quantityChange(20)
                .type(InventoryMovementType.IN)
                .user("user3")
                .date(LocalDateTime.now().plusHours(2))
                .build();

        List<InventoryMovement> movements = Arrays.asList(testInventoryMovement, movement2, movement3);
        Page<InventoryMovement> expectedPage = new PageImpl<>(movements, pageable, 3);
        
        when(inventoryMovementRepository.findAll(pageable)).thenReturn(expectedPage);

        Page<InventoryMovement> result = inventoryMovementService.getAllInventoryMovements(pageable);

        assertNotNull(result);
        assertEquals(3, result.getContent().size());
        assertEquals(testInventoryMovement, result.getContent().get(0));
        assertEquals(movement2, result.getContent().get(1));
        assertEquals(movement3, result.getContent().get(2));
        
        assertEquals(testProduct, result.getContent().get(0).getProduct());
        assertEquals(product2, result.getContent().get(1).getProduct());
        assertEquals(product3, result.getContent().get(2).getProduct());
        
        verify(inventoryMovementRepository).findAll(pageable);
    }

    @Test
    void testCreateInventoryMovementsWithDifferentTypes_ShouldHandleCorrectly() {
        InventoryMovement inMovement = InventoryMovement.builder()
                .id(4L)
                .product(testProduct)
                .quantityChange(15)
                .type(InventoryMovementType.IN)
                .user("admin")
                .date(LocalDateTime.now())
                .build();

        InventoryMovement outMovement = InventoryMovement.builder()
                .id(5L)
                .product(product2)
                .quantityChange(1)
                .type(InventoryMovementType.OUT)
                .user("admin")
                .date(LocalDateTime.now().plusHours(1))
                .build();

        when(inventoryMovementRepository.save(any(InventoryMovement.class)))
                .thenReturn(inMovement, outMovement);

        // Act
        InventoryMovement result1 = inventoryMovementService.create(inMovement);
        InventoryMovement result2 = inventoryMovementService.create(outMovement);

        // Assert
        assertNotNull(result1);
        assertNotNull(result2);
        assertEquals(InventoryMovementType.IN, result1.getType());
        assertEquals(InventoryMovementType.OUT, result2.getType());
        assertEquals(15, result1.getQuantityChange());
        assertEquals(1, result2.getQuantityChange());
        
        verify(inventoryMovementRepository, times(2)).save(any(InventoryMovement.class));
    }
}
