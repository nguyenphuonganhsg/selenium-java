import { faker } from '@faker-js/faker';

export class TestDataManager {
  private createdUsers: Set<string> = new Set();
  private createdProducts: Set<string> = new Set();
  
  async initialize() {
    console.log('Initializing Test Data Manager...');
  }
  
  async createUser(userData: {
    username: string;
    password: string;
    email: string;
  }) {
    // Simulate API call to create user
    console.log('Creating user:', userData.username);
    this.createdUsers.add(userData.username);
    
    // Return created user with ID
    return {
      id: faker.string.uuid(),
      ...userData,
      createdAt: new Date().toISOString(),
    };
  }
  
  async deleteUser(username: string) {
    console.log('Deleting user:', username);
    this.createdUsers.delete(username);
  }
  
  async createProduct(productData: {
    name: string;
    price: number;
    description?: string;
  }) {
    console.log('Creating product:', productData.name);
    const productId = faker.string.uuid();
    this.createdProducts.add(productId);
    
    return {
      id: productId,
      ...productData,
      createdAt: new Date().toISOString(),
    };
  }
  
  async deleteProduct(productId: string) {
    console.log('Deleting product:', productId);
    this.createdProducts.delete(productId);
  }
  
  async generateTestData(type: 'user' | 'product' | 'order') {
    switch (type) {
      case 'user':
        return {
          username: faker.internet.userName(),
          email: faker.internet.email(),
          password: faker.internet.password(),
          firstName: faker.person.firstName(),
          lastName: faker.person.lastName(),
        };
      
      case 'product':
        return {
          name: faker.commerce.productName(),
          price: parseFloat(faker.commerce.price()),
          description: faker.commerce.productDescription(),
          category: faker.commerce.department(),
        };
      
      case 'order':
        return {
          orderId: faker.string.uuid(),
          quantity: faker.number.int({ min: 1, max: 10 }),
          totalAmount: parseFloat(faker.commerce.price()),
          status: faker.helpers.arrayElement(['pending', 'processing', 'shipped', 'delivered']),
        };
      
      default:
        throw new Error(`Unknown data type: ${type}`);
    }
  }
  
  async cleanup() {
    console.log('Cleaning up test data...');
    
    // Delete all created users
    for (const username of this.createdUsers) {
      await this.deleteUser(username);
    }
    
    // Delete all created products
    for (const productId of this.createdProducts) {
      await this.deleteProduct(productId);
    }
    
    console.log('Test data cleanup completed');
  }
}