/**
 * Test cases minh họa sử dụng WORKER-SCOPED FIXTURES
 * Các fixtures này được share giữa các tests trong cùng worker
 */

import { workerTest as test, hybridTest } from '../fixtures/worker.fixture';
import { expect } from '@playwright/test';

test.describe('Worker-Scoped Fixtures Examples', () => {
  
  // Ví dụ 1: Sử dụng shared browser
  test('first test with shared browser', async ({ sharedBrowser }) => {
    const context = await sharedBrowser.newContext();
    const page = await context.newPage();
    
    await page.goto('https://example.com');
    const title = await page.title();
    expect(title).toBeTruthy();
    
    await context.close();
  });
  
  test('second test reuses same browser instance', async ({ sharedBrowser }) => {
    // Browser instance giống với test trước
    const context = await sharedBrowser.newContext();
    const page = await context.newPage();
    
    await page.goto('https://example.com/about');
    const title = await page.title();
    expect(title).toBeTruthy();
    
    await context.close();
  });
  
  // Ví dụ 2: Sử dụng shared authentication
  test('test with shared auth - test 1', async ({ sharedAuth, page }) => {
    // Apply shared auth to page
    await page.context().addCookies(sharedAuth.cookies);
    
    await page.goto('https://example.com/dashboard');
    // Không cần login vì đã có auth từ worker fixture
    
    await expect(page.locator('.user-dashboard')).toBeVisible();
  });
  
  test('test with shared auth - test 2', async ({ sharedAuth, page }) => {
    // Cùng auth state với test trước
    await page.context().addCookies(sharedAuth.cookies);
    
    await page.goto('https://example.com/profile');
    // Vẫn đã login
    
    await expect(page.locator('.user-profile')).toBeVisible();
  });
  
  // Ví dụ 3: Sử dụng shared account
  test('test with shared account - create post', async ({ sharedAccount, page }) => {
    console.log('Using account:', sharedAccount.username);
    
    await page.goto('https://example.com/login');
    await page.fill('#username', sharedAccount.username);
    await page.fill('#password', sharedAccount.password);
    await page.click('button[type="submit"]');
    
    // Create a post
    await page.goto('https://example.com/posts/new');
    await page.fill('#title', 'Test Post');
    await page.fill('#content', 'This is a test post');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('.success-message')).toBeVisible();
  });
  
  test('test with shared account - view posts', async ({ sharedAccount, page }) => {
    // Same account as previous test
    console.log('Using same account:', sharedAccount.username);
    
    await page.goto('https://example.com/login');
    await page.fill('#username', sharedAccount.username);
    await page.fill('#password', sharedAccount.password);
    await page.click('button[type="submit"]');
    
    // View posts created by same account
    await page.goto('https://example.com/my-posts');
    
    const posts = page.locator('.post-item');
    await expect(posts).toHaveCount(1); // Post from previous test
  });
  
  // Ví dụ 4: Sử dụng shared database connection
  test('test with shared db - insert data', async ({ sharedDbConnection }) => {
    await sharedDbConnection.query(
      'INSERT INTO test_table (name, value) VALUES ($1, $2)',
      ['test1', 'value1']
    );
    
    const results = await sharedDbConnection.query(
      'SELECT * FROM test_table WHERE name = $1',
      ['test1']
    );
    
    expect(results).toHaveLength(1);
  });
  
  test('test with shared db - reuse connection', async ({ sharedDbConnection }) => {
    // Same connection as previous test
    const results = await sharedDbConnection.query(
      'SELECT * FROM test_table'
    );
    
    // Data might be available from previous test if not cleaned
    console.log('Query results:', results);
  });
});

// Sử dụng hybrid fixtures (kết hợp worker và test scoped)
hybridTest.describe('Hybrid Fixtures Examples', () => {
  
  hybridTest('authenticated page test 1', async ({ authenticatedPage }) => {
    // Page đã có authentication từ worker fixture
    await authenticatedPage.goto('https://example.com/dashboard');
    
    // Không cần login
    await expect(authenticatedPage.locator('.dashboard')).toBeVisible();
    
    // Thực hiện actions với authenticated state
    await authenticatedPage.click('.create-button');
    await authenticatedPage.fill('#item-name', 'New Item');
    await authenticatedPage.click('button[type="submit"]');
  });
  
  hybridTest('authenticated page test 2', async ({ authenticatedPage }) => {
    // Different page instance nhưng same auth state
    await authenticatedPage.goto('https://example.com/settings');
    
    // Vẫn authenticated
    await expect(authenticatedPage.locator('.settings-panel')).toBeVisible();
  });
});