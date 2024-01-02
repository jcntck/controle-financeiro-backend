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
};

export default class DebitTransactionController {
  constructor(readonly debitTransactionRepository: DebitTransactionRepository) {}

  async get(): Promise<DebitTransaction[]> {
    return this.debitTransactionRepository.getAll();
  }

  async getById(id: string): Promise<DebitTransaction | null> {
    if (!Number(id)) throw new ValidationError('Id provided must be a number', 400);
    return this.debitTransactionRepository.getById(Number(id));
  }

  async post(body: DebitTransactionDTO): Promise<{ id: number }> {
    const transaction = new DebitTransaction({
      date: body.date,
      description: body.description,
      category_id: body.category.id,
      amount: body.amount,
      transactionType: body.transactionType,
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
