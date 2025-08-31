import { Page, Locator } from '@playwright/test';

export class LoginPage {
  private page: Page;
  
  // Locators
  private usernameInput: Locator;
  private passwordInput: Locator;
  private loginButton: Locator;
  private errorMessage: Locator;
  private rememberMeCheckbox: Locator;
  
  constructor(page: Page) {
    this.page = page;
    
    // Initialize locators
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.locator('button[type="submit"]');
    this.errorMessage = page.locator('.error-message');
    this.rememberMeCheckbox = page.locator('#remember-me');
  }
  
  async goto() {
    await this.page.goto('/login');
  }
  
  async login(username: string, password: string, rememberMe = false) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    
    if (rememberMe) {
      await this.rememberMeCheckbox.check();
    }
    
    await this.loginButton.click();
  }
  
  async getErrorMessage(): Promise<string> {
    return await this.errorMessage.textContent() || '';
  }
  
  async isErrorVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }
  
  async waitForLoginSuccess() {
    await this.page.waitForURL('**/dashboard', { timeout: 10000 });
  }
}