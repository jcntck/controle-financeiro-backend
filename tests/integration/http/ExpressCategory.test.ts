import path from "path";
import fs from "fs";
import superset from "supertest";

import ExpressAdapter from "../../../src/adapters/ExpressAdapter";
import CategoryJsonRepository from "../../../src/repository/CategoryJsonRepository";
import CategoryController from "../../../src/controller/CategoryController";
import CategoryRoute from "../../../src/routes/CategoryRoutes";
import { Application } from "express";

let app: Application;
const databasePath = path.resolve(process.cwd(), "data", "categories-integration-test.json");

beforeAll(() => {
  const httpAdapter = new ExpressAdapter();

  const categoryRepository = new CategoryJsonRepository(databasePath);
  const categoryController = new CategoryController(categoryRepository);
  new CategoryRoute(httpAdapter, categoryController);

  app = httpAdapter.app;
});

afterAll(() => {
  const databaseExists = fs.existsSync(databasePath);
  if (databaseExists) {
    fs.unlinkSync(databasePath);
  }
});

test("POST api/v1/categories", async () => {
  await superset(app)
    .post("/api/v1/categories")
    .send({
      name: "Delete",
      color: "#d3d3d3",
    })
    .expect(201)
    .catch((error) => console.log(error));
});

test("POST Error api/v1/categories", async () => {
  await superset(app)
    .post("/api/v1/categories")
    .send({
      name: "Delete",
      color: "#d3d3d3",
    })
    .expect(422)
    .expect({ error: "Category already exists with this name or color" })
    .catch((error) => console.error(error));
});

test("GET api/v1/categories", async () => {
  await superset(app)
    .get("/api/v1/categories")
    .expect(200)
    .catch((error) => console.log(error));
});

test("GET api/v1/categories/1", async () => {
  await superset(app)
    .get("/api/v1/categories/1")
    .expect(200)
    .catch((error) => console.log(error));
});

test("PUT api/v1/categories/1", async () => {
  await superset(app)
    .put("/api/v1/categories/1")
    .send({
      name: "Delete 01",
      color: "#d3d3d3",
    })
    .expect(204)
    .catch((error) => {
      console.log(error);
    });
});

test("DELETE api/v1/categories/1", async () => {
  await superset(app)
    .delete("/api/v1/categories/1")
    .expect(204)
    .catch((error) => {
      console.log(error);
    });
});
