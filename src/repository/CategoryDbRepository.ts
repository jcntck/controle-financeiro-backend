import { ResultBuilder } from 'pg';
import DatabaseAdapter from '../core/adapters/DatabaseAdapter';
import Category from '../core/entity/Category';
import CategoryRepository from '../core/repository/CategoryRepository';
import ValidationError from '../helpers/ValidationError';

export default class CategoryDbRepository implements CategoryRepository {
  private tableName = 'categories';

  constructor(readonly dbAdapter: DatabaseAdapter) {}

  async getAll(): Promise<Category[]> {
    try {
      await this.dbAdapter.connect();
      const result = await this.dbAdapter.query(`SELECT * FROM ${this.tableName};`);
      const data: Category[] = this.treatResult(result, true);
      await this.dbAdapter.close();
      return data || [];
    } catch (err) {
      if (this.dbAdapter.checkConnection()) await this.dbAdapter.close();
      throw err;
    }
  }

  async getById(id: number): Promise<Category | null> {
    try {
      await this.dbAdapter.connect();
      const result = await this.dbAdapter.query(`SELECT * FROM ${this.tableName} WHERE id = $1;`, [id]);
      const data: Category = this.treatResult(result);
      await this.dbAdapter.close();
      return data;
    } catch (err) {
      if (this.dbAdapter.checkConnection()) await this.dbAdapter.close();
      throw err;
    }
  }

  count(): Promise<number> {
    throw new Error('Method not implemented.');
  }

  async save(category: Category): Promise<number> {
    try {
      let result;
      await this.dbAdapter.connect();
      if (!category.id) {
        result = await this.dbAdapter.query(`INSERT INTO ${this.tableName}(name, color) VALUES ($1, $2) RETURNING *;`, [
          category.name,
          category.color,
        ]);
      } else {
        result = await this.dbAdapter.query(`UPDATE ${this.tableName} SET name = $1, color = $2 WHERE id = $3 RETURNING *;`, [
          category.name,
          category.color,
          category!.id,
        ]);
      }
      await this.dbAdapter.close();
      const data: { id: number } = this.treatResult(result);
      return data.id;
    } catch (err: any) {
      if (this.dbAdapter.checkConnection()) await this.dbAdapter.close();
      throw this.handleError(err);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.dbAdapter.connect();
      await this.dbAdapter.query(`DELETE FROM ${this.tableName} WHERE id = $1;`, [id]);
      await this.dbAdapter.close();
    } catch (err) {
      if (this.dbAdapter.checkConnection()) await this.dbAdapter.close();
      throw err;
    }
  }

  private treatResult(result: ResultBuilder, isArray: Boolean = false): any {
    if (!result.rowCount) return null;
    if (result.rowCount === 1 && !isArray) {
      const [data] = result.rows;
      return data;
    }
    return result.rows;
  }

  private handleError(err: any) {
    if (err.code == 23505) return new ValidationError('Category already exists with this name or color', 422);
    return err;
  }
}
