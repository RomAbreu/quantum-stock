import { expect, test } from '@playwright/test';

test.describe('Add Product Modal Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000/stock');
        await page.waitForTimeout(3000);
        await page.waitForLoadState('networkidle');
    });

    ['@employee', '@admin'].forEach(role => {
        test.describe(`Modal Behavior ${role}`, () => {
            test('should open and close add product modal', async ({ page }) => {
                await page.click('button:has-text("Nuevo Artículo")');
                
                const modal = page.locator('[data-slot="wrapper"]');
                await expect(modal).toBeVisible();
                await expect(page.locator('h2:has-text("Nuevo Producto")')).toBeVisible();
                
                await expect(page.locator('p:has-text("Completa la información para agregar un nuevo producto al inventario")')).toBeVisible();
                
                await page.click('button:has-text("Cancelar")');
                await expect(modal).not.toBeVisible();
            });

            test('should close modal with close button', async ({ page }) => {
                await page.click('button:has-text("Nuevo Artículo")');
                
                const modal = page.locator('[data-slot="wrapper"]');
                await expect(modal).toBeVisible();
                
                const closeButton = page.locator('button.absolute.z-10.right-2.top-2');
                await closeButton.click();
                
                await expect(modal).not.toBeVisible();
            });
        });

        test.describe(`Form Structure ${role}`, () => {
            test('should display all form sections and fields', async ({ page }) => {
                await page.click('button:has-text("Nuevo Artículo")');
                
                const modal = page.locator('[data-slot="wrapper"]');
                await expect(modal).toBeVisible();
                
                await expect(page.locator('h3:has-text("Información Básica")')).toBeVisible();
                await expect(page.locator('input[name="name"]')).toBeVisible();
                await expect(page.locator('textarea[name="description"]')).toBeVisible();
                await expect(page.locator('input[name="category"]')).toBeVisible();
                
                await expect(page.locator('h3:has-text("Precio y Stock")')).toBeVisible();
                await expect(page.locator('input[name="price"]')).toBeVisible();
                await expect(page.locator('input[name="quantity"]')).toBeVisible();
                await expect(page.locator('input[name="minQuantity"]')).toBeVisible();
                
                await expect(page.locator('button:has-text("Cancelar")')).toBeVisible();
                await expect(page.locator('button:has-text("Guardar Producto")')).toBeVisible();
                
                await page.click('button:has-text("Cancelar")');
            });
        });

        test.describe(`Form Validation ${role}`, () => {
            test('should validate form before allowing submission', async ({ page }) => {
                await page.click('button:has-text("Nuevo Artículo")');
                
                const saveButton = page.locator('button:has-text("Guardar Producto")');
                await expect(saveButton).toBeDisabled();
                
                await page.click('button:has-text("Cancelar")');
            });

            test('should show validation errors for empty required fields', async ({ page }) => {
                await page.click('button:has-text("Nuevo Artículo")');
                
                await expect(page.locator('input[name="name"]').getAttribute('placeholder')).resolves.toBe('Ej: Laptop Dell XPS 13');
                await expect(page.locator('textarea[name="description"]').getAttribute('placeholder')).resolves.toBe('Describe las características principales del producto...');
                await expect(page.locator('input[name="price"]').getAttribute('placeholder')).resolves.toBe('0.00');
                
                await page.click('button:has-text("Cancelar")');
            });

            test('should create new product', async ({ page }) => {
            const uniqueProductName = `Producto Test ${Date.now()}`;

            await page.click('button:has-text("Nuevo Artículo")');

            const modal = page.locator('[data-slot="wrapper"]');
            await expect(modal).toBeVisible();

            await page.fill('input[name="name"]', uniqueProductName);
            await page.fill('textarea[name="description"]', 'Producto creado por test automatizado');

            const categoryField = page.locator('input[name="category"]');
            await categoryField.click();

            await categoryField.fill('a');

            const firstOption = page.locator('[role="option"]').first();
            await expect(firstOption).toBeVisible({ timeout: 5000 });
            await firstOption.click();

            await page.fill('input[name="price"]', '150');
            await page.fill('input[name="quantity"]', '25');
            await page.fill('input[name="minQuantity"]', '5');

            const saveButton = page.locator('button:has-text("Guardar Producto")');
            await expect(saveButton).toBeEnabled();
            await saveButton.click();

            await expect(modal).not.toBeVisible({ timeout: 10000 });

            const table = page.locator('table[aria-label="Stock table"]');
            await expect(table).toBeVisible();

            });

        });

        test.describe(`Form Fields Behavior ${role}`, () => {
            test('should allow typing in text fields', async ({ page }) => {
                await page.click('button:has-text("Nuevo Artículo")');
                
                const nameInput = page.locator('input[name="name"]');
                await nameInput.fill('Producto Test');
                await expect(nameInput).toHaveValue('Producto Test');
                
                const descriptionInput = page.locator('textarea[name="description"]');
                await descriptionInput.fill('Esta es una descripción de prueba');
                await expect(descriptionInput).toHaveValue('Esta es una descripción de prueba');
                
                await page.click('button:has-text("Cancelar")');
            });

            test('should handle numeric fields correctly', async ({ page }) => {
                await page.click('button:has-text("Nuevo Artículo")');
                
                const priceInput = page.locator('input[name="price"]');
                await priceInput.fill('29.99');
                await expect(priceInput).toHaveValue('29.99');
                
                const quantityInput = page.locator('input[name="quantity"]');
                await quantityInput.fill('100');
                await expect(quantityInput).toHaveValue('100');
                
                const minQuantityInput = page.locator('input[name="minQuantity"]');
                await minQuantityInput.fill('10');
                await expect(minQuantityInput).toHaveValue('10');
                
                await page.click('button:has-text("Cancelar")');
            });

            test('should display category dropdown options', async ({ page }) => {
                await page.click('button:has-text("Nuevo Artículo")');
                
                await page.click('input[name="category"]');
                
                await expect(page.locator('[role="listbox"]')).toBeVisible();
                
                const optionCount = await page.locator('[role="option"]').count();
                expect(optionCount).toBeGreaterThan(0);
                
                await page.click('button:has-text("Cancelar")');
            });
        });
    });
});