import DatabaseAdapter from '../core/adapters/DatabaseAdapter';
import { Pool, PoolClient } from 'pg';

export class PgAdapter implements DatabaseAdapter {
  private client?: PoolClient;
  private pool: Pool;
  private isConnected = false;

  constructor() {
    this.pool = new Pool({
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      user: process.env.POSTGRES_USER,
      database: process.env.POSTGRES_DB,
      password: process.env.POSTGRES_PASSWORD,
    });
  }

  async connect(): Promise<void> {
    this.client = await this.pool.connect();
    this.isConnected = true;
  }

  async query(stmt: string, values?: any[]): Promise<any> {
    return this.client!.query(stmt, values);
  }

  async close(): Promise<void> {
    await this.client!.release();
    this.isConnected = false;
  }

  async end(): Promise<void> {
    await this.pool.end();
  }

  checkConnection(): Boolean {
    return this.isConnected;
  }
}
