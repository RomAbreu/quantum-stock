import path from 'node:path';
import { expect, test as setup } from '@playwright/test';

const adminAuthFile = path.join(__dirname, '../playwright/.auth/admin.json');
const employeeAuthFile = path.join(__dirname, '../playwright/.auth/employee.json');

setup('authenticate as admin', async ({ page }) => {
    await page.goto(
        'https://auth.quantum-stock.rabreus.tech/realms/quantum-stock/protocol/openid-connect/auth?client_id=quantum-stock-frontend&redirect_uri=https%3A%2F%2Fquantum-stock.rabreus.tech%2F&state=00359c3f-3dd9-40dd-a1ff-49ee1d18007a&response_mode=fragment&response_type=code&scope=openid&nonce=b3665cd9-f940-4df7-b608-9a464a55d7a1&code_challenge=89KVCwqShfMRLFW8WVgXMHQdIVlVKShxfv3EYaXqzW8&code_challenge_method=S256',
    );

    await page.fill('input#username', 'admin@admin.com');
    await page.fill('input#password', process.env.ADMIN_PASSWORD ?? 'admin');

    await page.click('button[type="submit"]');

    await page.waitForURL('https://quantum-stock.rabreus.tech/');

    await expect(page.locator('a:has-text("Stock")').first()).toBeVisible();
    await expect(page.locator('a:has-text("Dashboard")').first()).toBeVisible();
	await expect(page.locator('a:has-text("Movements")').first()).toBeVisible();
    await expect(page.locator('button').filter({ hasText: 'admin' })).toBeVisible();

    await page.context().storageState({ path: adminAuthFile });
});

setup('authenticate as employee', async ({ page }) => {
    await page.goto(
        'https://auth.quantum-stock.rabreus.tech/realms/quantum-stock/protocol/openid-connect/auth?client_id=quantum-stock-frontend&redirect_uri=https%3A%2F%2Fquantum-stock.rabreus.tech%2F&state=4d6d38e1-ddb0-43e9-82aa-c9a3f303864e&response_mode=fragment&response_type=code&scope=openid&nonce=4e653437-87cd-42fc-a0e3-cfc6423237c2&code_challenge=OCll7tkpYgY4QCcGt7t4z06f6QlXwaFxQ7nU8xfWljs&code_challenge_method=S256',
    );

    await page.fill('input#username', 'employee@employee.com');
    await page.fill('input#password', process.env.EMPLOYEE_PASSWORD ?? 'employee');

    await page.click('button[type="submit"]');

    await page.waitForURL('https://quantum-stock.rabreus.tech/');

    await expect(page.locator('a:has-text("Stock")').first()).toBeVisible();
    await expect(page.locator('a:has-text("Dashboard")').first()).toBeVisible();
    await expect(page.locator('a:has-text("Movements")').first()).toBeVisible();
    await expect(page.locator('button').filter({ hasText: 'employee' })).toBeVisible();

    await page.context().storageState({ path: employeeAuthFile });
});