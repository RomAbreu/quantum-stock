import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    fullyParallel: false,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',
    use: {
        baseURL: 'https://quantum-stock.rabreus.tech',
        ignoreHTTPSErrors: true,
        trace: 'on-first-retry',
        actionTimeout: 0,
    },
    projects: [
        {
            name: 'setup',
            testMatch: /.*\.setup\.ts/,
        },
        
        // Tests compartidos (como footer)
        {
            name: 'shared-components',
            use: { ...devices['Desktop Chrome'] },
            testIgnore: /.*\.setup\.ts/,
            testMatch: /footer\.spec\.ts/, // Solo tests de componentes compartidos
        },
        
        {
            name: 'unauthenticated',
            use: { ...devices['Desktop Chrome'] },
            testIgnore: /.*\.setup\.ts|footer\.spec\.ts/, // Excluir footer
            grep: /@unauthenticated/,
        },
        
        {
            name: 'admin-tests',
            use: {
                ...devices['Desktop Chrome'],
                storageState: 'playwright/.auth/admin.json',
            },
            dependencies: ['setup'],
            testIgnore: /.*\.setup\.ts|footer\.spec\.ts/, // Excluir footer
            grep: /@admin/,
        },
        
        {
            name: 'employee-tests',
            use: {
                ...devices['Desktop Chrome'],
                storageState: 'playwright/.auth/employee.json',
            },
            dependencies: ['setup'],
            testIgnore: /.*\.setup\.ts|footer\.spec\.ts/, // Excluir footer
            grep: /@employee/,
        },
    ],
});