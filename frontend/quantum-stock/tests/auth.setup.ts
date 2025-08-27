import path from 'node:path';
import { expect, test as setup } from '@playwright/test';

const adminAuthFile = path.join(__dirname, '../playwright/.auth/admin.json');
const employeeAuthFile = path.join(__dirname, '../playwright/.auth/employee.json');

setup('authenticate as admin', async ({ page }) => {
    // Start from the main application URL to trigger proper OAuth flow
    await page.goto('https://quantum-stock.rabreus.tech/');
    
    // Wait for redirect to auth server
    await page.waitForURL(/auth\.quantum-stock\.rabreus\.tech/, { timeout: 10000 });
    
    await page.fill('input#username', 'admin@admin.com');
    await page.fill('input#password', process.env.ADMIN_PASSWORD ?? 'admin');

    // Wait for navigation to complete after clicking submit
    await Promise.all([
        page.waitForURL('https://quantum-stock.rabreus.tech/', { timeout: 60000 }),
        page.click('button[type="submit"]')
    ]);

    // Wait for the page to fully load before checking elements
    await page.waitForLoadState('networkidle');

    await expect(page.locator('a:has-text("Stock")').first()).toBeVisible();
    await expect(page.locator('a:has-text("Dashboard")').first()).toBeVisible();
    await expect(page.locator('a:has-text("Movements")').first()).toBeVisible();
    await expect(page.locator('button').filter({ hasText: 'admin' })).toBeVisible();

    await page.context().storageState({ path: adminAuthFile });
});

setup('authenticate as employee', async ({ page }) => {
    // Start from the main application URL to trigger proper OAuth flow
    await page.goto('https://quantum-stock.rabreus.tech/');
    
    // Wait for redirect to auth server
    await page.waitForURL(/auth\.quantum-stock\.rabreus\.tech/, { timeout: 10000 });

    await page.fill('input#username', 'employee@employee.com');
    await page.fill('input#password', process.env.EMPLOYEE_PASSWORD ?? 'employee');

    // Wait for navigation to complete after clicking submit
    await Promise.all([
        page.waitForURL('https://quantum-stock.rabreus.tech/', { timeout: 60000 }),
        page.click('button[type="submit"]')
    ]);

    // Wait for the page to fully load before checking elements
    await page.waitForLoadState('networkidle');

    await expect(page.locator('a:has-text("Stock")').first()).toBeVisible();
    await expect(page.locator('a:has-text("Dashboard")').first()).toBeVisible();
    await expect(page.locator('a:has-text("Movements")').first()).toBeVisible();
    await expect(page.locator('button').filter({ hasText: 'employee' })).toBeVisible();

    await page.context().storageState({ path: employeeAuthFile });
});