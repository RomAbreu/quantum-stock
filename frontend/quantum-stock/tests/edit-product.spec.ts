import { expect, test } from '@playwright/test';

test.describe('Edit Product Modal Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000/stock');
        await page.waitForTimeout(3000);
        await page.waitForLoadState('networkidle');
    });

    ['@employee', '@admin'].forEach(role => {
        test.describe(`Modal Behavior ${role}`, () => {
            test('should open and close edit product modal', async ({ page }) => {
                const editButton = page.locator('button[title="Editar"]').first();
                await editButton.click();
                
                const modal = page.locator('[data-slot="wrapper"]');
                await expect(modal).toBeVisible();
                await expect(page.locator('h2:has-text("Editar Producto")')).toBeVisible();
                
                await expect(page.locator('p:has-text("Actualiza la información del producto")')).toBeVisible();
                
                await page.click('button:has-text("Cancelar")');
                await expect(modal).not.toBeVisible();
            });

            test('should close modal with close button', async ({ page }) => {
                const editButton = page.locator('button[title="Editar"]').first();
                await editButton.click();
                
                const modal = page.locator('[data-slot="wrapper"]');
                await expect(modal).toBeVisible();
                
                const closeButton = page.locator('button.absolute.top-1.end-1');
                await closeButton.click();
                
                await expect(modal).not.toBeVisible();
            });
        });

        test.describe(`Form Structure ${role}`, () => {
            test('should display all form sections and fields with product data', async ({ page }) => {
                const editButton = page.locator('button[title="Editar"]').first();
                await editButton.click();
                
                const modal = page.locator('[data-slot="wrapper"]');
                await expect(modal).toBeVisible();
                
                await expect(page.locator('h3:has-text("Información Básica")')).toBeVisible();
                await expect(page.locator('h3:has-text("Precio y Stock")')).toBeVisible();
                
                const nameInput = page.locator('input[name="name"]');
                await expect(nameInput).toBeVisible();
                await expect(nameInput).not.toHaveValue('');
                
                const descriptionInput = page.locator('textarea[name="description"]');
                await expect(descriptionInput).toBeVisible();
                await expect(descriptionInput).not.toHaveValue('');
                
                await expect(page.locator('input[name="category"]')).toBeVisible();
                await expect(page.locator('input[name="price"]')).toBeVisible();
                await expect(page.locator('input[name="quantity"]')).toBeVisible();
                await expect(page.locator('input[name="minQuantity"]')).toBeVisible();
                
                await expect(page.locator('button:has-text("Cancelar")')).toBeVisible();
                await expect(page.locator('button:has-text("Actualizar Producto")')).toBeVisible();
                
                await page.click('button:has-text("Cancelar")');
            });
        });

        test.describe(`Form Validation ${role}`, () => {
            test('should validate form before allowing submission', async ({ page }) => {
                const editButton = page.locator('button[title="Editar"]').first();
                await editButton.click();
                
                await page.fill('input[name="name"]', '');
                
                const updateButton = page.locator('button:has-text("Actualizar Producto")');
                await expect(updateButton).toBeDisabled();
                
                await page.click('button:has-text("Cancelar")');
            });

            test('should show validation errors for invalid fields', async ({ page }) => {
                const editButton = page.locator('button[title="Editar"]').first();
                await editButton.click();
                
                await page.fill('input[name="price"]', '0');
                await page.fill('input[name="name"]', '');
                await page.fill('input[name="name"]', 'Producto Test');
                
                const updateButton = page.locator('button:has-text("Actualizar Producto")');
                await expect(updateButton).toBeDisabled();
                
                await page.click('button:has-text("Cancelar")');
            });

            test('should update product successfully', async ({ page }) => {
                const editButton = page.locator('button[title="Editar"]').first();
                await editButton.click();
                
                const modal = page.locator('[data-slot="wrapper"]');
                await expect(modal).toBeVisible();
                
                const originalName = await page.locator('input[name="name"]').inputValue();
                const updatedName = `${originalName} - Editado ${Date.now()}`;
                
                await page.fill('input[name="name"]', updatedName);
                await page.fill('textarea[name="description"]', 'Producto actualizado por test automatizado');
                await page.fill('input[name="price"]', '299.99');
                await page.fill('input[name="quantity"]', '30');
                await page.fill('input[name="minQuantity"]', '8');
                
                await page.waitForTimeout(500);
                
                const updateButton = page.locator('button:has-text("Actualizar Producto")');
                await expect(updateButton).toBeEnabled();
                await updateButton.click();
                
                await expect(modal).not.toBeVisible({ timeout: 10000 });
                
                await page.waitForTimeout(2000);
                await page.waitForLoadState('networkidle');
                
                const table = page.locator('table[aria-label="Stock table"]');
                await expect(table).toBeVisible();
            });
        });

        test.describe(`Form Fields Behavior ${role}`, () => {
            test('should allow editing text fields', async ({ page }) => {
                const editButton = page.locator('button[title="Editar"]').first();
                await editButton.click();
                
                const nameInput = page.locator('input[name="name"]');
                const originalName = await nameInput.inputValue();
                
                await nameInput.fill('Producto Editado Test');
                await expect(nameInput).toHaveValue('Producto Editado Test');
                
                await nameInput.fill(originalName);
                
                const descriptionInput = page.locator('textarea[name="description"]');
                const originalDescription = await descriptionInput.inputValue();
                
                await descriptionInput.fill('Nueva descripción de prueba');
                await expect(descriptionInput).toHaveValue('Nueva descripción de prueba');
                
                await descriptionInput.fill(originalDescription);
                
                await page.click('button:has-text("Cancelar")');
            });

            test('should handle numeric fields correctly', async ({ page }) => {
                const editButton = page.locator('button[title="Editar"]').first();
                await editButton.click();
                
                const priceInput = page.locator('input[name="price"]');
                await priceInput.fill('89.99');
                await expect(priceInput).toHaveValue('89.99');
                
                const quantityInput = page.locator('input[name="quantity"]');
                await quantityInput.fill('50');
                await expect(quantityInput).toHaveValue('50');
                
                const minQuantityInput = page.locator('input[name="minQuantity"]');
                await minQuantityInput.fill('12');
                await expect(minQuantityInput).toHaveValue('12');
                
                await page.click('button:has-text("Cancelar")');
            });

            test('should display category dropdown with pre-selected value', async ({ page }) => {
                const editButton = page.locator('button[title="Editar"]').first();
                await editButton.click();
                
                const categoryInput = page.locator('input[name="category"]');
                const categoryValue = await categoryInput.inputValue();
                expect(categoryValue).not.toBe('');
                
                await categoryInput.click();
                
                await expect(page.locator('[role="listbox"]')).toBeVisible();
                
                const optionCount = await page.locator('[role="option"]').count();
                expect(optionCount).toBeGreaterThan(0);
                
                await page.click('body');
                await page.waitForSelector('[role="listbox"]', { state: 'hidden' });
                
                await page.click('button:has-text("Cancelar")');
            });
        });
    });
});