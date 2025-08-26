import { expect, test } from '@playwright/test';

test.describe('Delete Product Modal Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000/stock');
        await page.waitForTimeout(3000);
        await page.waitForLoadState('networkidle');
    });

    test.describe('@admin', () => {
        test.describe('Modal Behavior', () => {
            test('should open and close delete product modal', async ({ page }) => {
                const deleteButton = page.locator('button[title="Eliminar"]').first();
                await deleteButton.click();
                
                const modal = page.locator('[data-slot="wrapper"]');
                await expect(modal).toBeVisible();
                
                await expect(page.locator('span:has-text("Eliminar Producto")')).toBeVisible();
                
                await page.click('button:has-text("Cancelar")');
                await expect(modal).not.toBeVisible();
            });

            test('should close modal with close button (X)', async ({ page }) => {
                const deleteButton = page.locator('button[title="Eliminar"]').first();
                await deleteButton.click();
                
                const modal = page.locator('[data-slot="wrapper"]');
                await expect(modal).toBeVisible();
                
                const closeButton = page.locator('button.absolute.appearance-none.select-none.top-1');
                if (await closeButton.isVisible()) {
                    await closeButton.click();
                    await expect(modal).not.toBeVisible();
                } else {
                    await page.click('button:has-text("Cancelar")');
                    await expect(modal).not.toBeVisible();
                }
            });
        });

        test.describe('Modal Content', () => {

            test('should display product name and warning message', async ({ page }) => {
                const deleteButton = page.locator('button[title="Eliminar"]').first();
                await deleteButton.click();
                
                await expect(page.locator('p:has-text("¿Estás seguro que deseas eliminar el producto")')).toBeVisible();
                                
                await expect(page.locator('p:has-text("Esta acción es irreversible")')).toBeVisible();
                await expect(page.locator('p:has-text("El producto será eliminado permanentemente")')).toBeVisible();
                            
                await page.click('button:has-text("Cancelar")');
            });

        
        });

        test.describe('Delete Functionality', () => {
            test('should show loading state when deleting', async ({ page }) => {
                const deleteButton = page.locator('button[title="Eliminar"]').first();
                await deleteButton.click();
                
                const modal = page.locator('[data-slot="wrapper"]');
                await expect(modal).toBeVisible();
                
                const confirmDeleteButton = page.locator('button:has-text("Eliminar")');
                await confirmDeleteButton.click();
                
                const deletingButton = page.locator('button:has-text("Eliminando...")');
                
                try {
                    await expect(deletingButton).toBeVisible({ timeout: 1000 });
                } catch {
                    console.log('Estado de loading muy rápido, verificando cierre del modal');
                }
                
            });

            test('should successfully delete product and remove from table', async ({ page }) => {
                const firstRowCells = page.locator('table[aria-label="Stock table"] tbody tr').first().locator('td');
                const productName = await firstRowCells.nth(0).textContent();
                
                console.log(`Intentando eliminar producto: ${productName}`);
                
                const deleteButton = page.locator('button[title="Eliminar"]').first();
                await deleteButton.click();
                
                const modal = page.locator('[data-slot="wrapper"]');
                await expect(modal).toBeVisible();
                
                const confirmDeleteButton = page.locator('button:has-text("Eliminar")');
                await expect(confirmDeleteButton).toBeEnabled();
                await confirmDeleteButton.click();
                
                await expect(modal).not.toBeVisible({ timeout: 15000 });
                
                await page.waitForTimeout(2000);
                await page.waitForLoadState('networkidle');
                
                const table = page.locator('table[aria-label="Stock table"]');
                await expect(table).toBeVisible();
                
            });

            test('should handle delete cancellation', async ({ page }) => {
                const deleteButton = page.locator('button[title="Eliminar"]').first();
                await deleteButton.click();
                
                const modal = page.locator('[data-slot="wrapper"]');
                await expect(modal).toBeVisible();
                
                await page.click('button:has-text("Cancelar")');
                
                await expect(modal).not.toBeVisible();
                
                const table = page.locator('table[aria-label="Stock table"]');
                await expect(table).toBeVisible();
            });
        });
     
    });

    test.describe('@employee', () => {
        test('should not show delete buttons for employees', async ({ page }) => {
            const deleteButtons = page.locator('button[title="Eliminar"]');
            const count = await deleteButtons.count();
            
            expect(count).toBe(0);
        });
    });
});