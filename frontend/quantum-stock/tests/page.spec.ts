import { expect, test } from '@playwright/test';

test.describe('Homepage - unauthenticated @unauthenticated', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000');
        await page.waitForTimeout(5000);
        await page.waitForLoadState('networkidle');
    });

    test('should have the correct title', async ({ page }) => {
        await page.waitForSelector('h1');
        const title = await page.title();
        expect(title).toBe('Quantum Stock');
    });

    test('should display partial navigation menu for users unauthenticated', async ({ page }) => {
        await expect(page.locator('a:has-text("Stock")').first()).toBeVisible();
    });

    test('should display the hero section', async ({ page }) => {
        await expect(
            page.locator('h1:has-text("Quantum Stock")').first(),
        ).toBeVisible();
        await expect(
            page
                .locator(
                    'p:has-text("Revoluciona la gestión de tu inventario con precisión cuántica . Optimiza, analiza y controla tu stock con inteligencia artificial y análisis predictivo en tiempo real.")',
                )
                .first(),
        ).toBeVisible();
    });
});

test.describe('Homepage - authenticated as admin @admin', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:3000');
        await page.waitForTimeout(5000);
        await page.waitForLoadState('networkidle');
    });

    test('should display full navigation menu for admin users', async ({ page }) => {
        await expect(page.locator('a:has-text("Stock")').first()).toBeVisible();
        await expect(page.locator('a:has-text("Dashboard")').first()).toBeVisible();
        await expect(page.locator('a:has-text("Movements")').first()).toBeVisible();
    });

    test('should display the hero section', async ({ page }) => {
        await expect(
            page.locator('h1:has-text("Quantum Stock")').first(),
        ).toBeVisible();
        await expect(
            page
                .locator(
                    'p:has-text("Revoluciona la gestión de tu inventario con precisión cuántica . Optimiza, analiza y controla tu stock con inteligencia artificial y análisis predictivo en tiempo real.")',
                )
                .first(),
        ).toBeVisible();
    });
});

test.describe('Homepage - authenticated as employee @employee', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://quantum-stock.rabreus.tech');
        await page.waitForTimeout(5000);
        await page.waitForLoadState('networkidle');
    });

    test('should display full navigation menu for employee users', async ({ page }) => {
        await expect(page.locator('a:has-text("Stock")').first()).toBeVisible();
        await expect(page.locator('a:has-text("Dashboard")').first()).toBeVisible();
        await expect(page.locator('a:has-text("Movements")').first()).toBeVisible();
    });

    test('should display the hero section', async ({ page }) => {
        await expect(
            page.locator('h1:has-text("Quantum Stock")').first(),
        ).toBeVisible();
        await expect(
            page
                .locator(
                    'p:has-text("Revoluciona la gestión de tu inventario con precisión cuántica . Optimiza, analiza y controla tu stock con inteligencia artificial y análisis predictivo en tiempo real.")',
                )
                .first(),
        ).toBeVisible();
    });
});