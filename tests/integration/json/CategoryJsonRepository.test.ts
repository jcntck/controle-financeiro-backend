import path from "node:path";
import process from "node:process";

import fs from "fs";

import Category from "../../../src/core/entity/Category";
import CategoryRepository from "../../../src/core/repository/CategoryRepository";
import CategoryJsonRepository from "../../../src/repository/CategoryJsonRepository";
import ValidationError from "../../../src/helpers/ValidationError";

let categoryRepository: CategoryRepository;
const databasePath = path.resolve(process.cwd(), "data", "categories-test.json");

const categoriesToCreate = [
  { name: "Casa", color: "#d3d3d3" },
  { name: "Academia", color: "#bf2640" },
  { name: "Lazer", color: "#000000" },
  { name: "Educação", color: "#ffa500" },
];

beforeAll(() => {
  categoryRepository = new CategoryJsonRepository(databasePath);
});

afterAll(() => {
  const databaseExists = fs.existsSync(databasePath);
  if (databaseExists) {
    fs.unlinkSync(databasePath);
  }
});

test.each(categoriesToCreate)("Should create each category successfully", async ({ name, color }) => {
  const id = await categoryRepository.save(new Category(name, color));
  const category = await categoryRepository.getById(id);
  expect(category).toEqual({
    id,
    name,
    color,
  });
});

test("Should edit a category successfully", async () => {
  const category = await categoryRepository.getById(1);
  const categoryToUpdate = new Category(category!.name, "#fff8e7", category!.id);
  await categoryRepository.save(categoryToUpdate);
  const categoryUpdated = await categoryRepository.getById(1);
  expect(categoryUpdated).toEqual({
    id: 1,
    name: "Casa",
    color: "#fff8e7",
  });
});

test("Should delete a category succesfully", async () => {
  const countBeforeDelete = await categoryRepository.count();
  await categoryRepository.delete(1);
  const countAfterDelete = await categoryRepository.count();
  expect(countAfterDelete).toBe(countBeforeDelete - 1);
});

test("Should create a category succesfully after delete one with id correct", async () => {
  const id = await categoryRepository.save(new Category("Casa", "blue"));
  const category = await categoryRepository.getById(id);
  expect(category).toEqual({
    id: 5,
    name: "Casa",
    color: "blue",
  });
});

test("Should return null if category not exists", async () => {
  const category = await categoryRepository.getById(-1);
  expect(category).toBeNull();
});

test("Should return an list of categories", async () => {
  const categories = await categoryRepository.getAll();
  expect(categories).toBeInstanceOf(Array);
});

test.each([new Category("Casa", "#30875b"), new Category("Casa", "#ffa500", 4)])(
  "Should throw an error when category's name is repeated",
  async (category: Category) => {
    await expect(() => categoryRepository.save(category)).rejects.toThrow(
      new ValidationError("Category already exists with this name or color", 422)
    );
  }
);
