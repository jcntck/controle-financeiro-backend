import DebitTransaction from '../entity/DebitTransaction';

export default interface DebitTransactionRepository {
  getAll(options: any): Promise<DebitTransaction[]>;
  getAllByExternalIds(external_ids: string[]): Promise<string[]>;
  getById(id: number): Promise<DebitTransaction | null>;
  getByExternalId(external_id: string): Promise<DebitTransaction | null>;
  save(debitTransaction: DebitTransaction): Promise<number>;
  delete(id: number): Promise<void>;
}
