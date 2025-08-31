import { Page, Locator } from '@playwright/test';

export class HomePage {
  private page: Page;
  
  // Locators
  private welcomeMessage: Locator;
  private userMenu: Locator;
  private logoutButton: Locator;
  private searchInput: Locator;
  private searchButton: Locator;
  
  constructor(page: Page) {
    this.page = page;
    
    // Initialize locators
    this.welcomeMessage = page.locator('.welcome-message');
    this.userMenu = page.locator('#user-menu');
    this.logoutButton = page.locator('#logout');
    this.searchInput = page.locator('input[type="search"]');
    this.searchButton = page.locator('button[aria-label="Search"]');
  }
  
  async goto() {
    await this.page.goto('/');
  }
  
  async getWelcomeMessage(): Promise<string> {
    return await this.welcomeMessage.textContent() || '';
  }
  
  async search(query: string) {
    await this.searchInput.fill(query);
    await this.searchButton.click();
  }
  
  async logout() {
    await this.userMenu.click();
    await this.logoutButton.click();
  }
  
  async isLoggedIn(): Promise<boolean> {
    return await this.userMenu.isVisible();
  }
}