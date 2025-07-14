import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate with Keycloak as user with roles', async ({ page }) => {
  await page.goto(
    'http://localhost:9090/realms/quantum-stock/protocol/openid-connect/auth?client_id=quantum-stock-frontend&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&state=4d6d38e1-ddb0-43e9-82aa-c9a3f303864e&response_mode=fragment&response_type=code&scope=openid&nonce=4e653437-87cd-42fc-a0e3-cfc6423237c2&code_challenge=OCll7tkpYgY4QCcGt7t4z06f6QlXwaFxQ7nU8xfWljs&code_challenge_method=S256'
  );

  await page.fill('input#username', process.env.NEXT_KEYCLOAK_USER ?? "withrole@withrole.com");
  await page.fill('input#password', process.env.NEXT_KEYCLOAK_PASSWORD ?? "withrole");

  await page.click('button[type="submit"]');
  
  await page.waitForURL('http://localhost:3000/');

  await expect(page.locator('a:has-text("Stock")').first()).toBeVisible();
  await expect(page.locator('a:has-text("Dashboard")').first()).toBeVisible();
  
  await expect(page.locator('button').filter({ hasText: process.env.KEYCLOAK_USER ?? "withrole@withrole.com" })).toBeVisible();
  
  await expect(page.locator('h1:has-text("Quantum Stock")').first()).toBeVisible();
  await expect(page.locator('p:has-text("Revoluciona la gestión de tu inventario con precisión cuántica . Optimiza, analiza y controla tu stock con inteligencia artificial y análisis predictivo en tiempo real.")').first()).toBeVisible();
  
  await page.context().storageState({ path: authFile });
});