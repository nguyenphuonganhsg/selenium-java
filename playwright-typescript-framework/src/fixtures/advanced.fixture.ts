/**
 * ADVANCED FIXTURES - Các fixtures nâng cao và patterns thường dùng
 */

import { test as base, Page, BrowserContext } from '@playwright/test';
import fs from 'fs/promises';
import path from 'path';

/**
 * FIXTURE VỚI PARAMETERS - Cho phép config fixture
 */
export const parameterizedTest = base.extend<{
  todoPage: (options?: { itemCount?: number }) => Promise<Page>;
}>({
  todoPage: async ({ page }, use) => {
    // Factory function để tạo page với options
    const factory = async (options?: { itemCount?: number }) => {
      await page.goto('https://demo.playwright.dev/todomvc');
      
      // Thêm items nếu được yêu cầu
      if (options?.itemCount) {
        for (let i = 0; i < options.itemCount; i++) {
          await page.locator('.new-todo').fill(`Item ${i + 1}`);
          await page.locator('.new-todo').press('Enter');
        }
      }
      
      return page;
    };
    
    await use(factory);
  },
});

/**
 * FIXTURE VỚI DEPENDENCY INJECTION
 */
interface Services {
  userService: {
    create: (data: any) => Promise<any>;
    delete: (id: string) => Promise<void>;
  };
  productService: {
    create: (data: any) => Promise<any>;
    delete: (id: string) => Promise<void>;
  };
}

export const diTest = base.extend<{
  services: Services;
  testContext: {
    createdUsers: string[];
    createdProducts: string[];
  };
}>({
  // Service container
  services: async ({}, use) => {
    const services: Services = {
      userService: {
        create: async (data) => {
          console.log('Creating user:', data);
          return { id: 'user_' + Date.now(), ...data };
        },
        delete: async (id) => {
          console.log('Deleting user:', id);
        },
      },
      productService: {
        create: async (data) => {
          console.log('Creating product:', data);
          return { id: 'product_' + Date.now(), ...data };
        },
        delete: async (id) => {
          console.log('Deleting product:', id);
        },
      },
    };
    
    await use(services);
  },

  // Test context để track created resources
  testContext: async ({ services }, use) => {
    const context = {
      createdUsers: [] as string[],
      createdProducts: [] as string[],
    };
    
    // Wrap services để auto-track
    const originalUserCreate = services.userService.create;
    services.userService.create = async (data) => {
      const user = await originalUserCreate(data);
      context.createdUsers.push(user.id);
      return user;
    };
    
    const originalProductCreate = services.productService.create;
    services.productService.create = async (data) => {
      const product = await originalProductCreate(data);
      context.createdProducts.push(product.id);
      return product;
    };
    
    await use(context);
    
    // Auto cleanup
    console.log('🧹 Auto-cleaning created resources...');
    for (const userId of context.createdUsers) {
      await services.userService.delete(userId);
    }
    for (const productId of context.createdProducts) {
      await services.productService.delete(productId);
    }
  },
});

/**
 * FIXTURE VỚI STATE MANAGEMENT
 */
export const stateTest = base.extend<{
  appState: {
    get: (key: string) => any;
    set: (key: string, value: any) => void;
    clear: () => void;
    snapshot: () => Record<string, any>;
  };
  localStorage: {
    setItem: (key: string, value: string) => Promise<void>;
    getItem: (key: string) => Promise<string | null>;
    clear: () => Promise<void>;
  };
}>({
  // In-memory state management
  appState: async ({}, use) => {
    const state = new Map<string, any>();
    
    const stateManager = {
      get: (key: string) => state.get(key),
      set: (key: string, value: any) => state.set(key, value),
      clear: () => state.clear(),
      snapshot: () => Object.fromEntries(state),
    };
    
    await use(stateManager);
    
    // Log final state for debugging
    console.log('Final state:', stateManager.snapshot());
    state.clear();
  },

  // Browser localStorage management
  localStorage: async ({ page }, use) => {
    const localStorage = {
      setItem: async (key: string, value: string) => {
        await page.evaluate(([k, v]) => {
          localStorage.setItem(k, v);
        }, [key, value]);
      },
      getItem: async (key: string) => {
        return await page.evaluate((k) => {
          return localStorage.getItem(k);
        }, key);
      },
      clear: async () => {
        await page.evaluate(() => {
          localStorage.clear();
        });
      },
    };
    
    await use(localStorage);
  },
});

/**
 * FIXTURE VỚI RETRY LOGIC
 */
export const retryTest = base.extend<{
  retryAction: <T>(action: () => Promise<T>, options?: {
    maxRetries?: number;
    delay?: number;
  }) => Promise<T>;
}>({
  retryAction: async ({}, use) => {
    const retry = async <T>(
      action: () => Promise<T>,
      options = { maxRetries: 3, delay: 1000 }
    ): Promise<T> => {
      let lastError: Error | undefined;
      
      for (let i = 0; i < options.maxRetries; i++) {
        try {
          return await action();
        } catch (error) {
          lastError = error as Error;
          console.log(`Retry ${i + 1}/${options.maxRetries} failed:`, error);
          if (i < options.maxRetries - 1) {
            await new Promise(resolve => setTimeout(resolve, options.delay));
          }
        }
      }
      
      throw lastError;
    };
    
    await use(retry);
  },
});

/**
 * FIXTURE VỚI MOCK DATA
 */
export const mockTest = base.extend<{
  mockServer: {
    start: () => Promise<void>;
    stop: () => Promise<void>;
    setResponse: (path: string, response: any) => void;
  };
  mockData: {
    users: () => any[];
    products: () => any[];
    orders: () => any[];
  };
}>({
  // Mock server để intercept requests
  mockServer: async ({ page }, use) => {
    const responses = new Map<string, any>();
    
    const server = {
      start: async () => {
        await page.route('**/api/**', (route) => {
          const url = new URL(route.request().url());
          const mockResponse = responses.get(url.pathname);
          
          if (mockResponse) {
            route.fulfill({
              status: 200,
              contentType: 'application/json',
              body: JSON.stringify(mockResponse),
            });
          } else {
            route.continue();
          }
        });
      },
      stop: async () => {
        await page.unroute('**/api/**');
      },
      setResponse: (path: string, response: any) => {
        responses.set(path, response);
      },
    };
    
    await server.start();
    await use(server);
    await server.stop();
  },

  // Mock data generators
  mockData: async ({}, use) => {
    const generators = {
      users: () => [
        { id: 1, name: 'John Doe', email: 'john@example.com' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
      ],
      products: () => [
        { id: 1, name: 'Product A', price: 100 },
        { id: 2, name: 'Product B', price: 200 },
      ],
      orders: () => [
        { id: 1, userId: 1, productId: 1, quantity: 2 },
        { id: 2, userId: 2, productId: 2, quantity: 1 },
      ],
    };
    
    await use(generators);
  },
});

/**
 * FIXTURE VỚI SCREENSHOT & VIDEO
 */
export const mediaTest = base.extend<{
  screenshot: {
    take: (name: string) => Promise<void>;
    compare: (name: string) => Promise<void>;
  };
  recorder: {
    start: () => Promise<void>;
    stop: () => Promise<void>;
  };
}>({
  screenshot: async ({ page }, use, testInfo) => {
    const screenshotDir = path.join(testInfo.outputDir, 'screenshots');
    await fs.mkdir(screenshotDir, { recursive: true });
    
    const screenshot = {
      take: async (name: string) => {
        const filePath = path.join(screenshotDir, `${name}.png`);
        await page.screenshot({ path: filePath, fullPage: true });
        console.log(`📸 Screenshot saved: ${filePath}`);
      },
      compare: async (name: string) => {
        // Visual regression testing
        await expect(page).toHaveScreenshot(`${name}.png`, {
          maxDiffPixels: 100,
        });
      },
    };
    
    await use(screenshot);
  },

  recorder: async ({ page, context }, use, testInfo) => {
    let videoPath: string | undefined;
    
    const recorder = {
      start: async () => {
        // Playwright tự động record nếu config video: 'on'
        console.log('🎥 Recording started...');
      },
      stop: async () => {
        const video = page.video();
        if (video) {
          videoPath = await video.path();
          console.log(`🎥 Video saved: ${videoPath}`);
        }
      },
    };
    
    await use(recorder);
  },
});

export { expect } from '@playwright/test';