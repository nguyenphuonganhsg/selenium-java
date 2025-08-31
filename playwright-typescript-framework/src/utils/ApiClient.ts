export class ApiClient {
  private baseUrl: string;
  private authToken?: string;
  
  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }
  
  async authenticate(username: string, password: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    
    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.token;
  }
  
  setAuthToken(token: string) {
    this.authToken = token;
  }
  
  async get(endpoint: string) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: this.getHeaders(),
    });
    
    if (!response.ok) {
      throw new Error(`GET request failed: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async post(endpoint: string, data: any) {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      throw new Error(`POST request failed: ${response.statusText}`);
    }
    
    return response.json();
  }
  
  async logout() {
    if (this.authToken) {
      await fetch(`${this.baseUrl}/auth/logout`, {
        method: 'POST',
        headers: this.getHeaders(),
      });
      this.authToken = undefined;
    }
  }
  
  async close() {
    // Cleanup connections if needed
  }
  
  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }
    
    return headers;
  }
}