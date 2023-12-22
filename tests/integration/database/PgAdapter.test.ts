import { PgAdapter } from "../../../src/adapters/PgAdapter";

let pgAdapter: PgAdapter;

beforeAll(() => {
  pgAdapter = new PgAdapter();
});

it("Should connect with database successfully", async () => {
  await pgAdapter.connect();
  expect(pgAdapter.checkConnection()).toBeTruthy();
});

it("Should make a query succesfully", async () => {
  const { rows } = await pgAdapter.query("SELECT 1 + 1 as sum;");
  const [result] = rows;
  expect(result.sum).toBe(2);
});

it("Should end the connection successfully", async () => {
  await pgAdapter.close();
  expect(pgAdapter.checkConnection()).toBeFalsy();
});
