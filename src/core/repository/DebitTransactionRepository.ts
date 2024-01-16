import DebitTransaction from '../entity/DebitTransaction';

export default interface DebitTransactionRepository {
  getAll(options: any): Promise<DebitTransaction[]>;
  getById(id: number): Promise<DebitTransaction | null>;
  save(debitTransaction: DebitTransaction): Promise<number>;
  delete(id: number): Promise<void>;
}
