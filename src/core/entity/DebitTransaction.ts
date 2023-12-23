import { DebitTransactionTypes } from '../enums/DebitTransactionTypes.enum';

export default class DebitTransaction {
  id?: number;
  date: Date;
  amount: number;
  description: string;
  transactionType: DebitTransactionTypes;
  external_id?: string;
  category_id: number;

  constructor({ id, date, amount, description, transactionType, external_id, category_id }: CreateObject) {
    if (id) this.id = id;
    this.date = date;
    this.amount = amount;
    this.description = description;
    this.transactionType = transactionType;
    if (external_id) this.external_id = external_id;
    this.category_id = category_id;
  }
}

type CreateObject = {
  id?: number;
  date: Date;
  amount: number;
  description: string;
  transactionType: DebitTransactionTypes;
  external_id?: string;
  category_id: number;
};
