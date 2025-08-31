/**
 * Test cases minh họa AUTO FIXTURES
 * Auto fixtures tự động chạy mà không cần gọi trong test
 */

import { autoTest as test, expect } from '../fixtures/base.fixture';

test.describe('Auto Fixtures Examples', () => {
  
  // autoSetup và autoCleanup fixtures sẽ tự động chạy cho mỗi test
  // mà không cần khai báo trong parameters
  
  test('test with automatic setup', async ({ page }) => {
    // autoSetup đã tự động:
    // - Set localStorage items
    // - Block analytics requests
    // - Prepare test environment
    
    await page.goto('https://example.com');
    
    // Verify localStorage was set by auto fixture
    const testMode = await page.evaluate(() => localStorage.getItem('test-mode'));
    expect(testMode).toBe('true');
    
    // Analytics requests are automatically blocked
    let analyticsBlocked = false;
    page.on('request', request => {
      if (request.url().includes('/analytics/')) {
        analyticsBlocked = true;
      }
    });
    
    await page.goto('https://example.com/page-with-analytics');
    expect(analyticsBlocked).toBeFalsy(); // Should be blocked by auto fixture
  });
  
  test('another test with auto fixtures', async ({ page }) => {
    // Auto fixtures run for this test too
    
    await page.goto('https://example.com/dashboard');
    
    // SessionStorage was set by auto fixture
    const sessionId = await page.evaluate(() => sessionStorage.getItem('session-id'));
    expect(sessionId).toBe('test-session');
  });
  
  test('failing test to see auto cleanup logging', async ({ page }) => {
    await page.goto('https://example.com');
    
    // This will fail to demonstrate error logging in auto fixture
    await expect(page.locator('.non-existent-element')).toBeVisible({ timeout: 1000 });
  });
  
  test.describe('Nested suite with auto fixtures', () => {
    // Auto fixtures apply to all tests in nested suites too
    
    test('nested test 1', async ({ page }) => {
      await page.goto('https://example.com');
      
      // Auto fixtures are active
      const testMode = await page.evaluate(() => localStorage.getItem('test-mode'));
      expect(testMode).toBe('true');
    });
    
    test('nested test 2', async ({ page }) => {
      await page.goto('https://example.com/about');
      
      // Auto fixtures are still active
      const sessionId = await page.evaluate(() => sessionStorage.getItem('session-id'));
      expect(sessionId).toBe('test-session');
    });
  });
});

// Có thể kết hợp auto fixtures với regular fixtures
test.describe('Combined Auto and Regular Fixtures', () => {
  
  test('use both auto and regular fixtures', async ({ page, loginPage, testUser }) => {
    // Auto fixtures đã chạy (localStorage, sessionStorage, etc.)
    // Plus sử dụng regular fixtures
    
    await loginPage.goto();
    await loginPage.login(testUser.username, testUser.password);
    
    // Verify auto fixture setup
    const testMode = await page.evaluate(() => localStorage.getItem('test-mode'));
    expect(testMode).toBe('true');
    
    // Regular fixture works normally
    await loginPage.waitForLoginSuccess();
  });
  
  test('complex test with multiple fixture types', async ({ 
    page, 
    apiClient,
    testData,
    randomData 
  }) => {
    // Auto fixtures provide base setup
    // Regular fixtures provide specific functionality
    
    // Generate test data
    const product = await testData.generateTestData('product');
    
    // Create via API
    const created = await apiClient.post('/products', product);
    
    // Verify on UI
    await page.goto(`/products/${created.id}`);
    await expect(page.locator('.product-name')).toContainText(product.name);
    
    // Auto fixtures handle cleanup logging automatically
  });
});