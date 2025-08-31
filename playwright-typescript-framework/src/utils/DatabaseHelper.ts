export interface DbConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

export class DatabaseHelper {
  private config: DbConfig;
  private connected: boolean = false;
  
  constructor(config: DbConfig) {
    this.config = config;
  }
  
  async connect() {
    console.log(`Connecting to database ${this.config.database} at ${this.config.host}:${this.config.port}...`);
    // Simulate database connection
    this.connected = true;
    console.log('Database connected successfully');
  }
  
  async disconnect() {
    if (this.connected) {
      console.log('Disconnecting from database...');
      this.connected = false;
      console.log('Database disconnected');
    }
  }
  
  async query(sql: string, params?: any[]): Promise<any[]> {
    if (!this.connected) {
      throw new Error('Database not connected');
    }
    
    console.log(`Executing query: ${sql}`);
    if (params) {
      console.log('With parameters:', params);
    }
    
    // Simulate query execution
    return [];
  }
  
  async insert(table: string, data: Record<string, any>): Promise<string> {
    const columns = Object.keys(data).join(', ');
    const values = Object.values(data);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
    
    const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING id`;
    const result = await this.query(sql, values);
    
    return result[0]?.id || 'mock-id';
  }
  
  async update(table: string, id: string, data: Record<string, any>): Promise<void> {
    const updates = Object.keys(data).map((key, i) => `${key} = $${i + 2}`).join(', ');
    const values = [id, ...Object.values(data)];
    
    const sql = `UPDATE ${table} SET ${updates} WHERE id = $1`;
    await this.query(sql, values);
  }
  
  async delete(table: string, id: string): Promise<void> {
    const sql = `DELETE FROM ${table} WHERE id = $1`;
    await this.query(sql, [id]);
  }
  
  async truncate(table: string): Promise<void> {
    const sql = `TRUNCATE TABLE ${table} CASCADE`;
    await this.query(sql);
  }
}