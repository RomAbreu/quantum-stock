import { expect, test } from '@playwright/test';

test.describe('Homepage - unauthenticated', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(3000);
    await page.waitForLoadState('networkidle');
  });

  test('should have the correct title', async ({ page }) => {
    await page.waitForSelector('h1');

    const title = await page.title();
    expect(title).toBe('Quantum Stock');
  });

  test('should display the hero section', async ({ page }) => {
    await expect(page.locator('h1:has-text("Quantum Stock")').first()).toBeVisible();
    await expect(page.locator('p:has-text("Revoluciona la gestión de tu inventario con precisión cuántica . Optimiza, analiza y controla tu stock con inteligencia artificial y análisis predictivo en tiempo real.")').first()).toBeVisible();
  });


});

test.describe('Homepage - authenticated with permission', () => {
  test.use({ storageState: 'playwright/.auth/user.json' });

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
  });

  test('should display full navigation menu for users with permissions', async ({ page }) => {
    await expect(page.locator('a:has-text("Stock")').first()).toBeVisible();
    await expect(page.locator('a:has-text("Dashboard")').first()).toBeVisible();

  });

});

test.describe('Homepage - authenticated without permission', () => {
  test.use({ storageState: 'playwright/.auth/user-no-perm.json' });

  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
  });

  test('should display simplified UI for users without permissions', async ({ page }) => {
    // Navigation items should NOT be visible
    await expect(page.locator('a:has-text("Dashboard")').first()).not.toBeVisible();
    await expect(page.locator('a:has-text("Stock")').first()).not.toBeVisible();
    
    // User profile should be visible for logout
    await expect(page.locator('button:has-text("withoutrole@withoutrole.com")').first()).toBeVisible();
  });

  test('should display simplified welcome message for users without permissions', async ({ page }) => {
    await expect(page.locator('h1:has-text("Quantum Stock")').first()).toBeVisible();
    await expect(page.locator('p:has-text("Bienvenido a Quantum Stock")').first()).toBeVisible();
  });


});