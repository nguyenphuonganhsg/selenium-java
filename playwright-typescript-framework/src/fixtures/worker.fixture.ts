/**
 * LOẠI 3: WORKER-SCOPED FIXTURES
 * Được share giữa các tests trong cùng một worker
 * Hữu ích cho việc setup expensive resources một lần
 */

import { test as base } from '@playwright/test';
import { chromium, Browser, BrowserContext } from '@playwright/test';

type WorkerFixtures = {
  // Shared browser instance cho cả worker
  sharedBrowser: Browser;
  
  // Shared authentication state
  sharedAuth: {
    token: string;
    cookies: Array<{
      name: string;
      value: string;
      domain: string;
      path: string;
    }>;
  };
  
  // Shared test account
  sharedAccount: {
    username: string;
    password: string;
    userId: string;
  };
  
  // Shared database connection
  sharedDbConnection: any;
};

export const workerTest = base.extend<{}, WorkerFixtures>({
  // Shared Browser - một browser instance cho cả worker
  sharedBrowser: [async ({}, use) => {
    console.log('🌐 Creating shared browser for worker...');
    const browser = await chromium.launch();
    await use(browser);
    console.log('🌐 Closing shared browser...');
    await browser.close();
  }, { scope: 'worker' }],

  // Shared Authentication - login một lần, dùng cho cả worker
  sharedAuth: [async ({ sharedBrowser }, use, workerInfo) => {
    console.log(`🔐 Setting up authentication for worker ${workerInfo.workerIndex}...`);
    
    // Tạo context tạm để login
    const context = await sharedBrowser.newContext();
    const page = await context.newPage();
    
    // Thực hiện login
    await page.goto('https://example.com/login');
    await page.fill('#username', 'shared-user');
    await page.fill('#password', 'shared-password');
    await page.click('button[type="submit"]');
    
    // Đợi login thành công
    await page.waitForURL('**/dashboard');
    
    // Lấy authentication data
    const cookies = await context.cookies();
    const token = await page.evaluate(() => localStorage.getItem('auth-token')) || '';
    
    await context.close();
    
    const authData = {
      token,
      cookies,
    };
    
    await use(authData);
    
    console.log('🔐 Cleaning up authentication...');
    // Có thể logout qua API nếu cần
  }, { scope: 'worker' }],

  // Shared Test Account - tạo một account dùng chung cho worker
  sharedAccount: [async ({}, use, workerInfo) => {
    console.log(`👤 Creating shared account for worker ${workerInfo.workerIndex}...`);
    
    const account = {
      username: `worker_${workerInfo.workerIndex}_${Date.now()}`,
      password: 'SecurePassword123!',
      userId: `user_${workerInfo.workerIndex}_${Date.now()}`,
    };
    
    // Tạo account qua API
    const response = await fetch('https://api.example.com/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(account),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create shared account');
    }
    
    await use(account);
    
    // Cleanup: xóa account
    console.log(`👤 Deleting shared account ${account.username}...`);
    await fetch(`https://api.example.com/users/${account.userId}`, {
      method: 'DELETE',
    });
  }, { scope: 'worker' }],

  // Shared Database Connection
  sharedDbConnection: [async ({}, use, workerInfo) => {
    console.log(`🗄️ Creating shared DB connection for worker ${workerInfo.workerIndex}...`);
    
    // Mock database connection
    const connection = {
      query: async (sql: string) => {
        console.log(`Executing query: ${sql}`);
        return [];
      },
      close: async () => {
        console.log('Closing DB connection');
      },
    };
    
    await use(connection);
    
    await connection.close();
  }, { scope: 'worker' }],
});

/**
 * Fixture kết hợp worker-scoped và test-scoped
 */
export const hybridTest = workerTest.extend<{
  authenticatedPage: Page;
}>({
  // Test-scoped fixture sử dụng worker-scoped auth
  authenticatedPage: async ({ page, sharedAuth }, use) => {
    // Apply shared authentication to page
    await page.context().addCookies(sharedAuth.cookies);
    
    await page.addInitScript((token) => {
      localStorage.setItem('auth-token', token);
    }, sharedAuth.token);
    
    await use(page);
  },
});