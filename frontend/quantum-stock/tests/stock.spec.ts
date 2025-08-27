import { expect, test } from '@playwright/test';

test.describe('Stock Page - Visual Tests', () => {
    test.describe('Unauthenticated User @unauthenticated', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('https://quantum-stock.rabreus.tech/stock');
            await page.waitForTimeout(3000);
            await page.waitForLoadState('networkidle');
        });

        test('should display stock page header without add button', async ({ page }) => {
            await expect(page.locator('h1:has-text("Quantum Inventory")')).toBeVisible();
            await expect(page.locator('p:has-text("Gestión inteligente de stock")')).toBeVisible();
            
            await expect(page.locator('button:has-text("Nuevo Artículo")')).not.toBeVisible();
        });

        test('should display breadcrumbs navigation', async ({ page }) => {
            await expect(page.locator('nav[aria-label="Breadcrumbs"]')).toBeVisible();
            await expect(page.locator('a:has-text("Inicio")')).toBeVisible();
            await expect(page.locator('span').filter({ hasText: 'Inventario' })).toBeVisible();
        });

        test('should display control panel with search and filters', async ({ page }) => {
            await expect(page.locator('input[placeholder*="Buscar"]')).toBeVisible();
            await expect(page.locator('button[title="Actualizar"]')).toBeVisible();
        });

        test('should display stock table without actions column', async ({ page }) => {
            await expect(page.locator('table[aria-label="Stock table"]')).toBeVisible();
            
            await expect(page.locator('th:has-text("Acciones")')).not.toBeVisible();
            
            await expect(page.locator('button[title="Editar"]')).not.toBeVisible();
            await expect(page.locator('button[title="Eliminar"]')).not.toBeVisible();
        });

        test('should display stats cards', async ({ page }) => {
            await expect(page.locator('p:has-text("Total Productos")')).toBeVisible();
        });

        test('should not display floating action button', async ({ page }) => {
            await expect(page.locator('.fixed button:has([data-icon="lucide:plus"])')).not.toBeVisible();
        });
    });

    test.describe('Employee User @employee', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('https://quantum-stock.rabreus.tech/stock');
            await page.waitForTimeout(3000);
            await page.waitForLoadState('networkidle');
        });

        test('should display stock page header with add button', async ({ page }) => {
            await expect(page.locator('h1:has-text("Quantum Inventory")')).toBeVisible();
            await expect(page.locator('p:has-text("Gestión inteligente de stock")')).toBeVisible();
            
            await expect(page.locator('button:has-text("Nuevo Artículo")')).toBeVisible();
        });

        test('should display stock table with edit actions but no delete', async ({ page }) => {
            await expect(page.locator('table[aria-label="Stock table"]')).toBeVisible();
            
            await expect(page.locator('th:has-text("Acciones")')).toBeVisible();
            
            await expect(page.locator('button[title="Editar"]').first()).toBeVisible();
            
            await expect(page.locator('button[title="Eliminar"]')).not.toBeVisible();
        });

        test('should display breadcrumbs navigation', async ({ page }) => {
            await expect(page.locator('nav[aria-label="Breadcrumbs"]')).toBeVisible();
            await expect(page.locator('a:has-text("Inicio")')).toBeVisible();
            await expect(page.locator('span').filter({ hasText: 'Inventario' })).toBeVisible();
        });

        test('should display control panel with search and filters', async ({ page }) => {
            await expect(page.locator('input[placeholder*="Buscar"]')).toBeVisible();
            await expect(page.locator('button[title="Actualizar"]')).toBeVisible();
        });

        test('should display stats cards', async ({ page }) => {
            await expect(page.locator('p:has-text("Total Productos")')).toBeVisible();
        });
    });

    test.describe('Admin User @admin', () => {
        test.beforeEach(async ({ page }) => {
            await page.goto('https://quantum-stock.rabreus.tech/stock');
            await page.waitForTimeout(3000);
            await page.waitForLoadState('networkidle');
        });

        test('should display stock page header with add button', async ({ page }) => {
            await expect(page.locator('h1:has-text("Quantum Inventory")')).toBeVisible();
            await expect(page.locator('p:has-text("Gestión inteligente de stock")')).toBeVisible();
            
            await expect(page.locator('button:has-text("Nuevo Artículo")')).toBeVisible();
        });

        test('should display stock table with all actions including delete', async ({ page }) => {
            await expect(page.locator('table[aria-label="Stock table"]')).toBeVisible();
            
            await expect(page.locator('th:has-text("Acciones")')).toBeVisible();
            
            await expect(page.locator('button[title="Editar"]').first()).toBeVisible();
            await expect(page.locator('button[title="Eliminar"]').first()).toBeVisible();
        });

        test('should display breadcrumbs navigation', async ({ page }) => {
            await expect(page.locator('nav[aria-label="Breadcrumbs"]')).toBeVisible();
            await expect(page.locator('a:has-text("Inicio")')).toBeVisible();
            await expect(page.locator('span').filter({ hasText: 'Inventario' })).toBeVisible();
        });

        test('should display control panel with search and filters', async ({ page }) => {
            await expect(page.locator('input[placeholder*="Buscar"]')).toBeVisible();
            await expect(page.locator('button[title="Actualizar"]')).toBeVisible();
            await expect(page.locator('input[placeholder*="Categoría"]')).toBeVisible();
        });

        test('should display stats cards', async ({ page }) => {
            await expect(page.locator('p:has-text("Total Productos")')).toBeVisible();
        });

        test('should display pagination when there are multiple pages', async ({ page }) => {
            const paginationInfo = page.locator('text=/Mostrando \\d+ a \\d+ de \\d+ productos/');
            await expect(paginationInfo).toBeVisible({ timeout: 10000 });
        });
    });
});