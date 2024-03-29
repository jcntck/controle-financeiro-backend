import { subDays } from 'date-fns';
import Category from '../core/entity/Category';
import DebitTransaction from '../core/entity/DebitTransaction';
import { DebitTransactionTypes } from '../core/enums/DebitTransactionTypes.enum';
import DebitTransactionRepository from '../core/repository/DebitTransactionRepository';
import ValidationError from '../helpers/ValidationError';

type DebitTransactionDTO = {
  date: Date;
  description: string;
  category: { id: number; name: string; color: string };
  amount: number;
  transactionType: DebitTransactionTypes;
  external_id?: string;
};

export default class DebitTransactionController {
  constructor(readonly debitTransactionRepository: DebitTransactionRepository) {}

  async get(options: { from: string; to: string }): Promise<DebitTransaction[]> {
    let { from, to } = options;
    const now = new Date();

    if (!from) {
      from = new Date(now.getFullYear(), now.getMonth(), 1).toJSON();
    }

    if (!to) {
      to = new Date(now.getFullYear(), now.getMonth() + 1, 0).toJSON();
    }

    return this.debitTransactionRepository.getAll({ from, to });
  }

  async getAllByExternalIds({ external_ids }: { external_ids: string }): Promise<string[]> {
    return this.debitTransactionRepository.getAllByExternalIds(JSON.parse(external_ids));
  }

  async getById(id: string): Promise<DebitTransaction | null> {
    if (!Number(id)) throw new ValidationError('Id provided must be a number', 400);
    return this.debitTransactionRepository.getById(Number(id));
  }

  async getByExternalId(external_id: string): Promise<DebitTransaction | null> {
    if (!String(external_id)) throw new ValidationError('External Id provided must be a string', 400);
    return this.debitTransactionRepository.getByExternalId(external_id);
  }

  async post(body: DebitTransactionDTO): Promise<{ id: number }> {
    const transaction = new DebitTransaction({
      date: body.date,
      description: body.description,
      category_id: body.category.id,
      amount: body.amount,
      transactionType: body.transactionType,
      external_id: body.external_id,
    });

    return { id: await this.debitTransactionRepository.save(transaction) };
  }

  async put(id: string, body: DebitTransactionDTO): Promise<void> {
    if (!Number(id)) throw new ValidationError('Id provided must be a number', 400);
    const transaction = new DebitTransaction({
      id: Number(id),
      date: body.date,
      description: body.description,
      category_id: body.category.id,
      amount: body.amount,
      transactionType: body.transactionType,
    });
    await this.debitTransactionRepository.save(transaction);
  }

  async delete(id: string): Promise<void> {
    if (!Number(id)) throw new ValidationError('Id provided must be a number', 400);
    await this.debitTransactionRepository.delete(Number(id));
  }
}
