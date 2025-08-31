# Playwright TypeScript Framework với Fixtures

## 📚 Giới thiệu về Fixtures

Fixtures trong Playwright là một cơ chế mạnh mẽ giúp:
- **Setup và Teardown**: Tự động chuẩn bị và dọn dẹp môi trường test
- **Dependency Injection**: Inject các dependencies vào test một cách clean
- **Code Reusability**: Tái sử dụng logic setup giữa các tests
- **Isolation**: Đảm bảo mỗi test chạy độc lập

## 🎯 Các loại Fixtures thường dùng

### 1. Test-Scoped Fixtures
- Được tạo mới cho mỗi test case
- Đảm bảo isolation hoàn toàn giữa các tests
- Phù hợp cho: Page Objects, Test Data, API Clients

```typescript
test('example', async ({ loginPage, testUser }) => {
  // loginPage và testUser được tạo mới cho test này
  await loginPage.login(testUser.username, testUser.password);
});
```

### 2. Worker-Scoped Fixtures  
- Được share giữa các tests trong cùng worker
- Tiết kiệm resources cho expensive operations
- Phù hợp cho: Shared authentication, Database connections, Browser instances

```typescript
// Shared auth được setup một lần cho cả worker
test('test 1', async ({ sharedAuth }) => {
  // Sử dụng shared auth
});

test('test 2', async ({ sharedAuth }) => {
  // Cùng auth state với test 1
});
```

### 3. Auto Fixtures
- Tự động chạy cho mọi test mà không cần khai báo
- Phù hợp cho: Global setup, Logging, Environment preparation

```typescript
// Auto fixtures chạy tự động
test('example', async ({ page }) => {
  // autoSetup đã chạy và setup môi trường
  // autoCleanup sẽ chạy sau khi test xong
});
```

## 📁 Cấu trúc Framework

```
playwright-typescript-framework/
├── src/
│   ├── fixtures/
│   │   ├── base.fixture.ts      # Test-scoped fixtures cơ bản
│   │   ├── worker.fixture.ts    # Worker-scoped fixtures
│   │   └── advanced.fixture.ts  # Advanced patterns
│   ├── pages/                   # Page Object Models
│   ├── utils/                   # Helper utilities
│   ├── data/                    # Test data
│   └── tests/                   # Test cases
├── config/                      # Configuration files
├── playwright.config.ts         # Playwright configuration
└── package.json
```

## 🚀 Cài đặt và Chạy Tests

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Setup environment
```bash
cp .env.example .env
# Edit .env với config của bạn
```

### 3. Chạy tests
```bash
# Chạy tất cả tests
npm test

# Chạy với UI mode
npm run test:ui

# Chạy với headed browser
npm run test:headed

# Debug mode
npm run test:debug
```

## 💡 Các Fixtures có sẵn

### Page Object Fixtures
- `loginPage`: Login page object
- `homePage`: Home page object

### API Fixtures
- `apiClient`: Basic API client
- `authenticatedApi`: Pre-authenticated API client

### Data Fixtures
- `testUser`: Dynamic test user (auto-created và cleaned)
- `testData`: Test data manager
- `randomData`: Faker instance cho random data

### Utility Fixtures
- `database`: Database helper
- `logger`: Logging utility

### Advanced Fixtures
- `retryAction`: Retry logic cho flaky operations
- `mockServer`: Mock API responses
- `screenshot`: Screenshot utilities
- `appState`: State management

## 📝 Ví dụ sử dụng

### Ví dụ 1: Test với Page Objects và Test Data
```typescript
test('complete user flow', async ({ loginPage, testUser, testData }) => {
  // testUser được tạo tự động
  await loginPage.goto();
  await loginPage.login(testUser.username, testUser.password);
  
  // Generate random product data
  const product = await testData.generateTestData('product');
  // ... test logic
  
  // Cleanup tự động sau test
});
```

### Ví dụ 2: Test với Shared Authentication
```typescript
workerTest('authenticated test', async ({ sharedAuth, page }) => {
  // Apply shared auth
  await page.context().addCookies(sharedAuth.cookies);
  
  // Navigate without login
  await page.goto('/dashboard');
  // Already authenticated
});
```

### Ví dụ 3: Test với Mock Data
```typescript
mockTest('test with mocked API', async ({ mockServer, mockData }) => {
  // Setup mock responses
  mockServer.setResponse('/api/users', mockData.users());
  
  // Test will receive mocked data
  await page.goto('/users');
});
```

## 🔧 Tạo Custom Fixtures

```typescript
// Extend base test với custom fixtures
export const customTest = base.extend<{
  myFixture: string;
}>({
  myFixture: async ({}, use) => {
    // Setup
    const value = 'custom value';
    
    // Provide to test
    await use(value);
    
    // Cleanup
    console.log('Cleaning up...');
  },
});
```

## 📚 Best Practices

1. **Sử dụng đúng scope**: 
   - Test-scoped cho data độc lập
   - Worker-scoped cho shared expensive resources
   - Auto fixtures cho global setup

2. **Cleanup tự động**: Luôn implement cleanup trong fixtures

3. **Dependency injection**: Sử dụng fixtures dependencies thay vì global state

4. **Naming convention**: Đặt tên fixtures mô tả rõ chức năng

5. **Avoid over-engineering**: Chỉ tạo fixtures khi thực sự cần reuse

## 🤝 Contributing

Xem [CONTRIBUTING.md](CONTRIBUTING.md) để biết hướng dẫn contribute.

## 📄 License

MIT