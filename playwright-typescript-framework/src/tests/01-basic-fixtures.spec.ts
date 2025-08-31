/**
 * Test cases minh họa sử dụng BASIC FIXTURES
 */

import { test, expect } from '../fixtures/base.fixture';

test.describe('Basic Fixtures Examples', () => {
  
  // Ví dụ 1: Sử dụng Page Object Fixtures
  test('should login using page object fixture', async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.login('testuser', 'password123');
    
    // Verify login success
    await expect(page).toHaveURL(/.*dashboard/);
  });
  
  // Ví dụ 2: Sử dụng API Client Fixture
  test('should fetch data using API client', async ({ apiClient }) => {
    const users = await apiClient.get('/users');
    
    expect(users).toBeDefined();
    expect(Array.isArray(users)).toBeTruthy();
  });
  
  // Ví dụ 3: Sử dụng Authenticated API Fixture
  test('should access protected endpoints with auth', async ({ authenticatedApi }) => {
    // authenticatedApi đã được authenticate tự động
    const profile = await authenticatedApi.get('/profile');
    
    expect(profile).toHaveProperty('username');
    expect(profile).toHaveProperty('email');
  });
  
  // Ví dụ 4: Sử dụng Test Data Fixtures
  test('should create and use test user', async ({ testUser, loginPage }) => {
    // testUser được tạo tự động với data ngẫu nhiên
    console.log('Test user created:', testUser);
    
    await loginPage.goto();
    await loginPage.login(testUser.username, testUser.password);
    
    // User sẽ được tự động xóa sau khi test xong
  });
  
  // Ví dụ 5: Sử dụng Random Data Generator
  test('should generate random test data', async ({ randomData, page }) => {
    const productName = randomData.commerce.productName();
    const price = randomData.commerce.price();
    const description = randomData.lorem.paragraph();
    
    await page.goto('/products/new');
    await page.fill('#product-name', productName);
    await page.fill('#product-price', price);
    await page.fill('#product-description', description);
    
    await page.click('button[type="submit"]');
    
    await expect(page.locator('.success-message')).toBeVisible();
  });
  
  // Ví dụ 6: Sử dụng Database Fixture
  test('should verify data in database', async ({ database, testUser }) => {
    // Query database để verify user được tạo
    const users = await database.query(
      'SELECT * FROM users WHERE username = $1',
      [testUser.username]
    );
    
    expect(users).toHaveLength(1);
    expect(users[0].email).toBe(testUser.email);
  });
  
  // Ví dụ 7: Kết hợp nhiều fixtures
  test('complete user flow with multiple fixtures', async ({
    testUser,
    loginPage,
    homePage,
    apiClient,
    testData,
    database
  }) => {
    // 1. Login với test user
    await loginPage.goto();
    await loginPage.login(testUser.username, testUser.password);
    
    // 2. Verify trên home page
    const welcomeMsg = await homePage.getWelcomeMessage();
    expect(welcomeMsg).toContain(testUser.username);
    
    // 3. Tạo product qua API
    const productData = await testData.generateTestData('product');
    const product = await apiClient.post('/products', productData);
    
    // 4. Verify trong database
    const dbProducts = await database.query(
      'SELECT * FROM products WHERE id = $1',
      [product.id]
    );
    expect(dbProducts).toHaveLength(1);
    
    // 5. Cleanup - tự động xảy ra sau test
  });
});