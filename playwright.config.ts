import { defineConfig, devices } from '@playwright/test';
import process from 'node:process';
export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 2,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'work/browser-report' }]],
  outputDir: 'work/test-results',
  use: { baseURL: 'http://127.0.0.1:4321', trace: 'retain-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
  ],
  webServer: { command: 'npm run preview -- --port 4321', url: 'http://127.0.0.1:4321', reuseExistingServer: !process.env.CI },
});
