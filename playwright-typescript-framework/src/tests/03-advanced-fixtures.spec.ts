/**
 * Test cases minh họa sử dụng ADVANCED FIXTURES
 */

import { 
  parameterizedTest,
  diTest,
  stateTest,
  retryTest,
  mockTest,
  mediaTest,
  expect
} from '../fixtures/advanced.fixture';

// Ví dụ 1: Parameterized Fixtures
parameterizedTest.describe('Parameterized Fixtures', () => {
  
  parameterizedTest('todo page with no items', async ({ todoPage }) => {
    const page = await todoPage(); // No parameters
    
    const items = page.locator('.todo-list li');
    await expect(items).toHaveCount(0);
  });
  
  parameterizedTest('todo page with 5 items', async ({ todoPage }) => {
    const page = await todoPage({ itemCount: 5 });
    
    const items = page.locator('.todo-list li');
    await expect(items).toHaveCount(5);
    
    // Verify items text
    for (let i = 0; i < 5; i++) {
      await expect(items.nth(i)).toContainText(`Item ${i + 1}`);
    }
  });
});

// Ví dụ 2: Dependency Injection Fixtures
diTest.describe('Dependency Injection Fixtures', () => {
  
  diTest('create resources with auto-tracking', async ({ services, testContext }) => {
    // Create user - automatically tracked
    const user = await services.userService.create({
      name: 'John Doe',
      email: 'john@example.com'
    });
    
    // Create products - automatically tracked
    const product1 = await services.productService.create({
      name: 'Product 1',
      price: 100
    });
    
    const product2 = await services.productService.create({
      name: 'Product 2',
      price: 200
    });
    
    // Verify tracking
    expect(testContext.createdUsers).toContain(user.id);
    expect(testContext.createdProducts).toContain(product1.id);
    expect(testContext.createdProducts).toContain(product2.id);
    
    // Resources will be auto-cleaned after test
  });
  
  diTest('verify auto-cleanup', async ({ services, testContext }) => {
    // Create resources
    await services.userService.create({ name: 'Jane' });
    await services.productService.create({ name: 'Product' });
    
    console.log('Created resources:', {
      users: testContext.createdUsers,
      products: testContext.createdProducts
    });
    
    // All will be cleaned up automatically
  });
});

// Ví dụ 3: State Management Fixtures
stateTest.describe('State Management Fixtures', () => {
  
  stateTest('in-memory state management', async ({ appState, page }) => {
    // Set state
    appState.set('currentUser', { id: 1, name: 'John' });
    appState.set('theme', 'dark');
    appState.set('language', 'en');
    
    // Get state
    const user = appState.get('currentUser');
    expect(user.name).toBe('John');
    
    // Use state in test
    await page.goto('/settings');
    const theme = appState.get('theme');
    await page.selectOption('#theme-selector', theme);
    
    // Get snapshot
    const snapshot = appState.snapshot();
    console.log('State snapshot:', snapshot);
  });
  
  stateTest('browser localStorage management', async ({ localStorage, page }) => {
    await page.goto('https://example.com');
    
    // Set localStorage items
    await localStorage.setItem('user-preference', 'dark-mode');
    await localStorage.setItem('last-visit', new Date().toISOString());
    
    // Get localStorage items
    const preference = await localStorage.getItem('user-preference');
    expect(preference).toBe('dark-mode');
    
    // Reload page and verify persistence
    await page.reload();
    const storedPref = await localStorage.getItem('user-preference');
    expect(storedPref).toBe('dark-mode');
    
    // Clear localStorage
    await localStorage.clear();
    const clearedPref = await localStorage.getItem('user-preference');
    expect(clearedPref).toBeNull();
  });
});

// Ví dụ 4: Retry Logic Fixtures
retryTest.describe('Retry Logic Fixtures', () => {
  
  retryTest('retry flaky operation', async ({ retryAction, page }) => {
    await page.goto('https://example.com');
    
    // Retry flaky API call
    const result = await retryAction(async () => {
      const response = await fetch('https://flaky-api.example.com/data');
      if (!response.ok) {
        throw new Error('API failed');
      }
      return response.json();
    }, { maxRetries: 5, delay: 2000 });
    
    expect(result).toBeDefined();
  });
  
  retryTest('retry element interaction', async ({ retryAction, page }) => {
    await page.goto('https://example.com');
    
    // Retry clicking dynamic element
    await retryAction(async () => {
      const button = page.locator('.dynamic-button');
      await expect(button).toBeVisible({ timeout: 5000 });
      await button.click();
    }, { maxRetries: 3, delay: 1000 });
  });
});

// Ví dụ 5: Mock Server Fixtures
mockTest.describe('Mock Server Fixtures', () => {
  
  mockTest('mock API responses', async ({ mockServer, mockData, page }) => {
    // Set mock responses
    mockServer.setResponse('/api/users', mockData.users());
    mockServer.setResponse('/api/products', mockData.products());
    
    // Navigate and verify mocked data
    await page.goto('https://example.com/users');
    
    // Page will receive mocked users
    const userElements = page.locator('.user-item');
    await expect(userElements).toHaveCount(2); // mockData.users() returns 2 users
    
    await page.goto('https://example.com/products');
    const productElements = page.locator('.product-item');
    await expect(productElements).toHaveCount(2);
  });
  
  mockTest('dynamic mock responses', async ({ mockServer, page }) => {
    let callCount = 0;
    
    // Set dynamic response based on call count
    mockServer.setResponse('/api/data', {
      count: callCount++,
      timestamp: Date.now()
    });
    
    await page.goto('https://example.com/dashboard');
    
    // First call
    await page.click('#refresh-button');
    
    // Update mock for next call
    mockServer.setResponse('/api/data', {
      count: callCount++,
      timestamp: Date.now(),
      updated: true
    });
    
    // Second call gets different response
    await page.click('#refresh-button');
  });
});

// Ví dụ 6: Screenshot & Video Fixtures
mediaTest.describe('Media Fixtures', () => {
  
  mediaTest('capture screenshots at key points', async ({ screenshot, page }) => {
    await page.goto('https://example.com');
    
    // Take screenshot at different stages
    await screenshot.take('01-homepage');
    
    await page.click('.login-button');
    await screenshot.take('02-login-page');
    
    await page.fill('#username', 'testuser');
    await page.fill('#password', 'password');
    await screenshot.take('03-filled-form');
    
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard');
    await screenshot.take('04-dashboard');
  });
  
  mediaTest('visual regression testing', async ({ screenshot, page }) => {
    await page.goto('https://example.com');
    
    // Compare with baseline screenshots
    await screenshot.compare('homepage-baseline');
    
    await page.click('.toggle-theme');
    await screenshot.compare('dark-theme-baseline');
  });
  
  mediaTest('record test execution', async ({ recorder, page }) => {
    await recorder.start();
    
    await page.goto('https://example.com');
    await page.click('.start-demo');
    await page.fill('#demo-input', 'Test data');
    await page.click('#submit-demo');
    
    await recorder.stop();
  });
});