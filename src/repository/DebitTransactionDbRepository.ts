import { ResultBuilder } from 'pg';
import DatabaseAdapter from '../core/adapters/DatabaseAdapter';
import DebitTransaction from '../core/entity/DebitTransaction';
import DebitTransactionRepository from '../core/repository/DebitTransactionRepository';

export default class DebitTransactionDbRepository implements DebitTransactionRepository {
  private tableName = 'debit_transactions';

  constructor(readonly dbAdapter: DatabaseAdapter) {}

  async getAll(): Promise<DebitTransaction[]> {
    try {
      await this.dbAdapter.connect();
      const result = await this.dbAdapter.query(`SELECT * FROM ${this.tableName};`);
      const data: DebitTransaction[] = this.treatResult(result, true);
      await this.dbAdapter.close();
      return data || [];
    } catch (err) {
      if (this.dbAdapter.checkConnection()) await this.dbAdapter.close();
      throw err;
    }
  }

  async getById(id: number): Promise<DebitTransaction | null> {
    try {
      await this.dbAdapter.connect();
      const result = await this.dbAdapter.query(`SELECT * FROM ${this.tableName} WHERE id = $1;`, [id]);
      const data = this.treatResult(result);
      await this.dbAdapter.close();
      return data;
    } catch (err) {
      if (this.dbAdapter.checkConnection()) await this.dbAdapter.close();
      throw err;
    }
  }

  async save(debitTransaction: DebitTransaction): Promise<number> {
    try {
      let result;
      await this.dbAdapter.connect();
      if (!debitTransaction.id) {
        result = await this.dbAdapter.query(
          `INSERT INTO ${this.tableName}(transaction_date, amount, description, transaction_type, external_id, category_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;`,
          [
            debitTransaction.date,
            debitTransaction.amount,
            debitTransaction.description,
            debitTransaction.transactionType,
            debitTransaction.external_id,
            debitTransaction.category_id,
          ]
        );
      } else {
        result = await this.dbAdapter.query(
          `UPDATE ${this.tableName} SET transaction_date = $1, amount = $2, description = $3, transaction_type = $4, external_id = $5, category_id = $6 WHERE id = $7 RETURNING *;`,
          [
            debitTransaction.date,
            debitTransaction.amount,
            debitTransaction.description,
            debitTransaction.transactionType,
            debitTransaction.external_id,
            debitTransaction.category_id,
            debitTransaction!.id,
          ]
        );
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
      return this.toEntity(data);
    }
    return result.rows.map((data) => this.toEntity(data));
  }

  private toEntity(data: any): DebitTransaction {
    return new DebitTransaction({
      id: data.id,
      amount: data.amount,
      category_id: data.category_id,
      date: new Date(data.transaction_date),
      description: data.description,
      transactionType: data.transaction_type,
      external_id: data.external_id,
    });
  }

  private handleError(err: any) {
    return err;
  }
}
