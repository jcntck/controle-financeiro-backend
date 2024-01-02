import { PgAdapter } from "../../../src/adapters/PgAdapter";
import DatabaseAdapter from "../../../src/core/adapters/DatabaseAdapter";
import Category from "../../../src/core/entity/Category";
import DebitTransaction from "../../../src/core/entity/DebitTransaction";
import { DebitTransactionTypes } from "../../../src/core/enums/DebitTransactionTypes.enum";
import CategoryRepository from "../../../src/core/repository/CategoryRepository";
import DebitTransactionRepository from "../../../src/core/repository/DebitTransactionRepository";
import CategoryDbRepository from "../../../src/repository/CategoryDbRepository";
import DebitTransactionDbRepository from "../../../src/repository/DebitTransactionDbRepository";
import resetTablesHelper from "../../helpers/resetTables.helper";

let dbAdapter: DatabaseAdapter;
let debitTransactionRepository: DebitTransactionRepository;
let categoryRepository: CategoryRepository;

beforeAll(() => {
  dbAdapter = new PgAdapter();
  debitTransactionRepository = new DebitTransactionDbRepository(dbAdapter);
  categoryRepository = new CategoryDbRepository(dbAdapter);
});

afterAll(async () => {
  await dbAdapter.connect();
  await resetTablesHelper(dbAdapter, "debit_transactions");
  await resetTablesHelper(dbAdapter, "categories");
  await dbAdapter.close();
  await dbAdapter.end();
});

it("Should return an empty array debitTransactions.getAll()", async () => {
  const transactions = await debitTransactionRepository.getAll();
  expect(transactions).toEqual([]);
});

it("Should return null when debitTransactions.getById() is called with nonexistent id", async () => {
  const transaction = await debitTransactionRepository.getById(1);
  expect(transaction).toBeNull();
});

it("Should create a new debit transaction", async () => {
  const category = new Category("Salário", "green");
  const categoryId = await categoryRepository.save(category);
  const debitTransaction = new DebitTransaction({
    date: new Date("2022-10-02T00:00:00"),
    amount: 2095.95,
    description: "Adiantamento de salário",
    transactionType: DebitTransactionTypes.REVENUE,
    category_id: categoryId,
  });
  const id = await debitTransactionRepository.save(debitTransaction);
  expect(id).toBe(1);
});

it("Should return an array debitTransactions.getAll()", async () => {
  const transactions = await debitTransactionRepository.getAll();
  expect(transactions.length).toBe(1);
});

it("Should return a transaction when debitTransactions.getById() is called", async () => {
  const transaction = await debitTransactionRepository.getById(1);
  expect(transaction).toBeInstanceOf(DebitTransaction);
});

it("Should edit a debit transaction", async () => {
  const transaction = await debitTransactionRepository.getById(1);
  transaction!.description = "Teste 01";
  await debitTransactionRepository.save(transaction!);
  const transactionAfterUpdate = await debitTransactionRepository.getById(1);
  expect(transactionAfterUpdate?.description).toBe("Teste 01");
});

it("Should delete a debit transaction", async () => {
  await debitTransactionRepository.delete(1);
  const transactions = await debitTransactionRepository.getAll();
  expect(transactions.length).toBe(0);
});
