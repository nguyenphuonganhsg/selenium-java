/**
 * Base Fixtures - Định nghĩa các fixtures cơ bản cho framework
 * 
 * Fixtures trong Playwright giúp:
 * 1. Setup và teardown môi trường test
 * 2. Tái sử dụng code
 * 3. Dependency injection
 * 4. Quản lý state và data
 */

import { test as base, Page } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { HomePage } from '@pages/HomePage';
import { ApiClient } from '@utils/ApiClient';
import { TestDataManager } from '@utils/TestDataManager';
import { DatabaseHelper } from '@utils/DatabaseHelper';
import { faker } from '@faker-js/faker';

// Định nghĩa types cho fixtures
type PageFixtures = {
  loginPage: LoginPage;
  homePage: HomePage;
};

type ApiFixtures = {
  apiClient: ApiClient;
  authenticatedApi: ApiClient;
};

type DataFixtures = {
  testData: TestDataManager;
  testUser: {
    username: string;
    password: string;
    email: string;
  };
  randomData: typeof faker;
};

type UtilityFixtures = {
  database: DatabaseHelper;
  logger: Console;
};

// Kết hợp tất cả fixtures
export type MyFixtures = PageFixtures & ApiFixtures & DataFixtures & UtilityFixtures;

/**
 * LOẠI 1: TEST-SCOPED FIXTURES
 * Được tạo mới cho mỗi test case
 */
export const test = base.extend<MyFixtures>({
  // Page Object Fixtures - Tự động khởi tạo Page Objects
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
    // Cleanup sau khi test xong (nếu cần)
  },

  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await use(homePage);
  },

  // API Client Fixtures
  apiClient: async ({}, use) => {
    const client = new ApiClient(process.env.API_BASE_URL || 'https://api.example.com');
    await use(client);
    // Cleanup: đóng connections nếu cần
    await client.close();
  },

  // Authenticated API Client - phụ thuộc vào apiClient
  authenticatedApi: async ({ apiClient }, use) => {
    // Login và lấy token
    const token = await apiClient.authenticate(
      process.env.API_USERNAME || 'testuser',
      process.env.API_PASSWORD || 'testpass'
    );
    apiClient.setAuthToken(token);
    await use(apiClient);
    // Cleanup: logout nếu cần
    await apiClient.logout();
  },

  // Test Data Fixtures
  testData: async ({}, use) => {
    const dataManager = new TestDataManager();
    await dataManager.initialize();
    await use(dataManager);
    // Cleanup: xóa test data đã tạo
    await dataManager.cleanup();
  },

  // Dynamic Test User - tạo user mới cho mỗi test
  testUser: async ({ testData }, use) => {
    const user = {
      username: faker.internet.userName(),
      password: faker.internet.password({ length: 12 }),
      email: faker.internet.email(),
    };
    
    // Tạo user trong hệ thống (qua API hoặc DB)
    await testData.createUser(user);
    
    await use(user);
    
    // Cleanup: xóa user sau khi test xong
    await testData.deleteUser(user.username);
  },

  // Random Data Generator
  randomData: async ({}, use) => {
    // Seed để có thể reproduce nếu cần
    faker.seed(Date.now());
    await use(faker);
  },

  // Database Helper
  database: async ({}, use) => {
    const db = new DatabaseHelper({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME || 'testdb',
      user: process.env.DB_USER || 'testuser',
      password: process.env.DB_PASSWORD || 'testpass',
    });
    
    await db.connect();
    await use(db);
    await db.disconnect();
  },

  // Logger Fixture
  logger: async ({}, use) => {
    // Có thể custom logger ở đây
    await use(console);
  },
});

/**
 * LOẠI 2: AUTO FIXTURES
 * Tự động chạy mà không cần gọi trong test
 */
export const autoTest = test.extend<{
  autoSetup: void;
  autoCleanup: void;
}>({
  // Auto fixture để setup môi trường
  autoSetup: [async ({ page }, use) => {
    console.log('🚀 Auto Setup: Preparing test environment...');
    
    // Ví dụ: Set cookies, localStorage, sessionStorage
    await page.addInitScript(() => {
      localStorage.setItem('test-mode', 'true');
      sessionStorage.setItem('session-id', 'test-session');
    });
    
    // Ví dụ: Mock network requests
    await page.route('**/analytics/**', route => route.abort());
    
    await use();
    
    console.log('🧹 Auto Cleanup: Cleaning up test environment...');
  }, { auto: true }],

  // Auto fixture để log test info
  autoCleanup: [async ({}, use, testInfo) => {
    console.log(`📝 Starting test: ${testInfo.title}`);
    const startTime = Date.now();
    
    await use();
    
    const duration = Date.now() - startTime;
    console.log(`✅ Test completed in ${duration}ms`);
    
    // Log errors nếu test fail
    if (testInfo.status === 'failed') {
      console.error(`❌ Test failed: ${testInfo.error?.message}`);
    }
  }, { auto: true }],
});

export { expect } from '@playwright/test';