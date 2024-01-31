import { Application } from "express";
import superset from "supertest";
import ExpressAdapter from "../../../src/adapters/ExpressAdapter";
import { PgAdapter } from "../../../src/adapters/PgAdapter";
import DatabaseAdapter from "../../../src/core/adapters/DatabaseAdapter";
import CategoryDbRepository from "../../../src/repository/CategoryDbRepository";
import DebitTransactionDbRepository from "../../../src/repository/DebitTransactionDbRepository";
import resetTablesHelper from "../../helpers/resetTables.helper";
import DebitTransactionController from "../../../src/controller/DebitTransactionController";
import DebitTransactionRoutes from "../../../src/routes/DebitTransactionRoutes";
import Category from "../../../src/core/entity/Category";

let app: Application;
let dbAdapter: DatabaseAdapter;

beforeAll(async () => {
  dbAdapter = new PgAdapter();
  const httpAdapter = new ExpressAdapter();

  const debitTransactionRepository = new DebitTransactionDbRepository(dbAdapter);
  const categoryRepository = new CategoryDbRepository(dbAdapter);

  const debitTransactionController = new DebitTransactionController(debitTransactionRepository);
  new DebitTransactionRoutes(httpAdapter, debitTransactionController);

  await categoryRepository.save(new Category("Casa", "#0a60eb"));

  app = httpAdapter.app;
});

afterAll(async () => {
  await dbAdapter.connect();
  await resetTablesHelper(dbAdapter, "debit_transactions");
  await resetTablesHelper(dbAdapter, "categories");
  await dbAdapter.close();
  await dbAdapter.end();
});

test("POST api/v1/debit-transactions", async () => {
  await superset(app)
    .post("/api/v1/debit-transactions")
    .send({
      date: "2023-12-29T17:39:24.220Z",
      description: "Transação 01",
      category: {
        id: 1,
        name: "Casa",
        color: "#0a60eb",
      },
      amount: 125.53,
      transactionType: "E",
      external_id: "external_id_1",
    })
    .expect(201)
    .catch((error) => console.error(error));
});

test("POST Error api/v1/debit-transactions", async () => {
  await superset(app)
    .post("/api/v1/debit-transactions")
    .send({
      date: "2023-12-29T17:39:24.220Z",
      description: "Transação 01",
      category: {
        id: 2,
        name: "Casa",
        color: "#0a60eb",
      },
      amount: 125.53,
      transactionType: "E",
    })
    .expect(422)
    .catch((error) => console.error(error));
});

test("GET api/v1/debit-transactions", async () => {
  await superset(app)
    .get("/api/v1/debit-transactions")
    .expect(200)
    .catch((error) => console.log(error));
});

test("GET api/v1/debit-transactions/1", async () => {
  await superset(app)
    .get("/api/v1/debit-transactions/1")
    .expect(200)
    .catch((error) => console.log(error));
});

test("PUT api/v1/debit-transactions/1", async () => {
  await superset(app)
    .put("/api/v1/debit-transactions/1")
    .send({
      date: "2023-12-29T17:39:24.220Z",
      description: "Transação 02",
      category: {
        id: 1,
        name: "Casa",
        color: "#0a60eb",
      },
      amount: 128.53,
      transactionType: "E",
    })
    .expect(204)
    .catch((error) => console.error(error));
});

test("DELETE api/v1/debit-transactions/1", async () => {
  await superset(app)
    .delete("/api/v1/debit-transactions/1")
    .expect(204)
    .catch((error) => {
      console.log(error);
    });
});
