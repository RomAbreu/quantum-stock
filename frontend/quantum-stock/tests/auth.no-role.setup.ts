import { test as setup, expect } from '@playwright/test';
import path from 'path';

const noPermFile = path.join(__dirname, '../playwright/.auth/user-no-perm.json');

setup('authenticate as user without permission', async ({ page }) => {
  await page.goto(
    'http://localhost:9090/realms/quantum-stock/protocol/openid-connect/auth?client_id=quantum-stock-frontend&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&state=4d6d38e1-ddb0-43e9-82aa-c9a3f303864e&response_mode=fragment&response_type=code&scope=openid&nonce=4e653437-87cd-42fc-a0e3-cfc6423237c2&code_challenge=OCll7tkpYgY4QCcGt7t4z06f6QlXwaFxQ7nU8xfWljs&code_challenge_method=S256'
  );

  await page.fill('input#username', process.env.NEXT_KEYCLOAK_USER_NO_ROLE ?? "withoutrole@withoutrole.com");
  await page.fill('input#password', process.env.NEXT_KEYCLOAK_PASSWORD_NO_ROLE ?? "withoutrole");

  await page.click('button[type="submit"]');
  
  await page.waitForURL('http://localhost:3000/');

  await expect(page.locator('a:has-text("Stock")').first()).not.toBeVisible();
  await expect(page.locator('a:has-text("Dashboard")').first()).not.toBeVisible();
  
  await expect(page.locator('button:has-text("withoutrole@withoutrole.com")').first()).toBeVisible();
  
  await expect(page.locator('h1:has-text("Quantum Stock")').first()).toBeVisible();
  await expect(page.locator('p:has-text("Bienvenido a Quantum Stock")').first()).toBeVisible();

  await page.context().storageState({ path: noPermFile });
});