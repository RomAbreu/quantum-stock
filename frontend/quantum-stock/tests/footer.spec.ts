import { expect, test } from '@playwright/test';

test.describe('Footer', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://quantum-stock.rabreus.tech/');
        await page.waitForTimeout(3000);
        await page.waitForLoadState('networkidle');
    });

    test('should display footer logo', async ({ page }) => {
        const footerLogo = page.locator('footer img[alt="QuantumStock Logo"]');
        await expect(footerLogo).toBeVisible();
        await expect(footerLogo).toHaveAttribute('src', '/images/logo.png');
    });

    test('should display copyright text with current year', async ({ page }) => {
        const currentYear = new Date().getFullYear();
        const copyrightText = page.locator(`footer p:has-text("© ${currentYear} QuantumStock")`);
        await expect(copyrightText).toBeVisible();
    });

    test('should have logo link pointing to home', async ({ page }) => {
        const logoLink = page.locator('footer a').filter({ has: page.locator('img[alt="QuantumStock Logo"]') });
        await expect(logoLink).toHaveAttribute('href', '/');
    });

    test('logo click should navigate to home', async ({ page }) => {
        const logoLink = page.locator('footer a').filter({ has: page.locator('img[alt="QuantumStock Logo"]') });
        await logoLink.click();
        await page.waitForURL('https://quantum-stock.rabreus.tech/');
        await expect(page).toHaveURL('https://quantum-stock.rabreus.tech/');
    });

    test('should have correct footer styling', async ({ page }) => {
        const footer = page.locator('footer');
        await expect(footer).toHaveClass(/bg-gray-900/);
        await expect(footer).toBeVisible();
    });
});