package org.example.backend.services;

import org.example.backend.enums.Category;
import org.example.backend.models.MinQuantityNotification;
import org.example.backend.models.Product;
import org.example.backend.repositories.MinQuantityNotificationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MinQuantityNotificationServiceTest {

    @Mock
    private MinQuantityNotificationRepository minQuantityNotificationRepository;

    @InjectMocks
    private MinQuantityNotificationService minQuantityNotificationService;

    private Product testProduct;
    private Product product2;
    private Product product3;
    private MinQuantityNotification testNotification;

    @BeforeEach
    void setUp() {
        testProduct = Product.builder()
                .id(1L)
                .name("Test Product")
                .description("Test Description")
                .category(Category.ELECTRONICS)
                .price(new BigDecimal("99.99"))
                .quantity(3)
                .minQuantity(5)
                .isActive(true)
                .build();

        testNotification = MinQuantityNotification.builder()
                .id(1L)
                .product(testProduct)
                .notificationDate(LocalDateTime.now())
                .build();

        product2 = Product.builder()
                .id(2L)
                .name("Product 2")
                .description("Description 2")
                .category(Category.CLOTHING)
                .price(new BigDecimal("49.99"))
                .quantity(2)
                .minQuantity(10)
                .isActive(true)
                .build();

        product3 = Product.builder()
                .id(3L)
                .name("Product 3")
                .description("Description 3")
                .category(Category.BOOKS)
                .price(new BigDecimal("29.99"))
                .quantity(1)
                .minQuantity(5)
                .isActive(true)
                .build();
    }

    @Test
    void testDeleteNotificationByProductId_ShouldDeleteSuccessfully() {
        Long productId = 1L;
        doNothing().when(minQuantityNotificationRepository).deleteById(productId);

        minQuantityNotificationService.deleteNotificationByProductId(productId);

        verify(minQuantityNotificationRepository).deleteById(productId);
    }


    @Test
    void testSaveNotification_ShouldSaveSuccessfully() {
        when(minQuantityNotificationRepository.save(any(MinQuantityNotification.class)))
                .thenReturn(testNotification);

        minQuantityNotificationService.saveNotification(testNotification);

        verify(minQuantityNotificationRepository).save(testNotification);
    }

    @Test
    void testGetNotificationById_ShouldReturnNotification() {
        // Arrange
        Long notificationId = 1L;
        when(minQuantityNotificationRepository.findById(notificationId))
                .thenReturn(Optional.of(testNotification));

        // Act
        MinQuantityNotification result = minQuantityNotificationService.getNotificationById(notificationId);

        // Assert
        assertNotNull(result);
        assertEquals(testNotification, result);
        verify(minQuantityNotificationRepository).findById(notificationId);
    }

    @Test
    void testGetNotificationById_WithNonExistentId_ShouldReturnNull() {
        Long notificationId = 999L;
        when(minQuantityNotificationRepository.findById(notificationId))
                .thenReturn(Optional.empty());

        MinQuantityNotification result = minQuantityNotificationService.getNotificationById(notificationId);

        assertNull(result);
        verify(minQuantityNotificationRepository).findById(notificationId);
    }

    @Test
    void testGetAllNotifications_ShouldReturnListOfNotifications() {
        // Arrange
        Product product2 = Product.builder()
                .id(2L)
                .name("Product 2")
                .description("Description 2")
                .category(Category.CLOTHING)
                .price(new BigDecimal("49.99"))
                .quantity(2)
                .minQuantity(10)
                .isActive(true)
                .build();

        MinQuantityNotification notification2 = MinQuantityNotification.builder()
                .id(2L)
                .product(product2)
                .notificationDate(LocalDateTime.now().plusHours(1))
                .build();

        List<MinQuantityNotification> expectedNotifications = Arrays.asList(testNotification, notification2);
        when(minQuantityNotificationRepository.findAll()).thenReturn(expectedNotifications);

        List<MinQuantityNotification> result = minQuantityNotificationService.getAllNotifications();

        assertNotNull(result);
        assertEquals(2, result.size());
        assertEquals(expectedNotifications, result);
        verify(minQuantityNotificationRepository).findAll();
    }

    @Test
    void testGetAllNotifications_WithEmptyList_ShouldReturnEmptyList() {
        List<MinQuantityNotification> emptyList = List.of();
        when(minQuantityNotificationRepository.findAll()).thenReturn(emptyList);

        List<MinQuantityNotification> result = minQuantityNotificationService.getAllNotifications();

        assertNotNull(result);
        assertTrue(result.isEmpty());
        verify(minQuantityNotificationRepository).findAll();
    }


    @Test
    void testMultipleNotificationsWithDifferentProducts_ShouldHandleCorrectly() {
        MinQuantityNotification notification2 = MinQuantityNotification.builder()
                .id(2L)
                .product(product2)
                .notificationDate(LocalDateTime.now().plusHours(1))
                .build();

        MinQuantityNotification notification3 = MinQuantityNotification.builder()
                .id(3L)
                .product(product3)
                .notificationDate(LocalDateTime.now().plusHours(2))
                .build();

        List<MinQuantityNotification> allNotifications = Arrays.asList(testNotification, notification2, notification3);
        when(minQuantityNotificationRepository.findAll()).thenReturn(allNotifications);

        List<MinQuantityNotification> result = minQuantityNotificationService.getAllNotifications();

        assertNotNull(result);
        assertEquals(3, result.size());
        assertEquals(testNotification, result.get(0));
        assertEquals(notification2, result.get(1));
        assertEquals(notification3, result.get(2));
        
        assertEquals(testProduct, result.get(0).getProduct());
        assertEquals(product2, result.get(1).getProduct());
        assertEquals(product3, result.get(2).getProduct());
        
        verify(minQuantityNotificationRepository).findAll();
    }

    @Test
    void testDeleteMultipleNotifications_ShouldHandleAllCorrectly() {
        doNothing().when(minQuantityNotificationRepository).deleteById(anyLong());

        minQuantityNotificationService.deleteNotificationByProductId(1L);
        minQuantityNotificationService.deleteNotificationByProductId(2L);
        minQuantityNotificationService.deleteNotificationByProductId(3L);

        verify(minQuantityNotificationRepository).deleteById(1L);
        verify(minQuantityNotificationRepository).deleteById(2L);
        verify(minQuantityNotificationRepository).deleteById(3L);
        verify(minQuantityNotificationRepository, times(3)).deleteById(anyLong());
    }

    @Test
    void testSaveMultipleNotifications_ShouldHandleAllCorrectly() {
        // Arrange
        MinQuantityNotification notification2 = MinQuantityNotification.builder()
                .id(2L)
                .product(product2)
                .notificationDate(LocalDateTime.now().plusHours(1))
                .build();

        MinQuantityNotification notification3 = MinQuantityNotification.builder()
                .id(3L)
                .product(product3)
                .notificationDate(LocalDateTime.now().plusHours(2))
                .build();

        when(minQuantityNotificationRepository.save(any(MinQuantityNotification.class)))
                .thenReturn(testNotification, notification2, notification3);

        // Act
        minQuantityNotificationService.saveNotification(testNotification);
        minQuantityNotificationService.saveNotification(notification2);
        minQuantityNotificationService.saveNotification(notification3);

        // Assert
        verify(minQuantityNotificationRepository).save(testNotification);
        verify(minQuantityNotificationRepository).save(notification2);
        verify(minQuantityNotificationRepository).save(notification3);
        verify(minQuantityNotificationRepository, times(3)).save(any(MinQuantityNotification.class));
    }
}
