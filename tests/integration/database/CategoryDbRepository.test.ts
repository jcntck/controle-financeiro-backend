import { PgAdapter } from '../../../src/adapters/PgAdapter';
import DatabaseAdapter from '../../../src/core/adapters/DatabaseAdapter';
import Category from '../../../src/core/entity/Category';
import CategoryRepository from '../../../src/core/repository/CategoryRepository';
import ValidationError from '../../../src/helpers/ValidationError';
import CategoryDbRepository from '../../../src/repository/CategoryDbRepository';
import resetTablesHelper from '../../helpers/resetTables.helper';

let dbAdapter: DatabaseAdapter;
let categoryRepository: CategoryRepository;

beforeAll(() => {
  dbAdapter = new PgAdapter();
  categoryRepository = new CategoryDbRepository(dbAdapter);
});

afterAll(async () => {
  await dbAdapter.connect();
  await resetTablesHelper(dbAdapter, 'categories');
  await dbAdapter.close();
  await dbAdapter.end();
});

it.each([new Category('Casa', '#d3d3d3'), new Category('Educação', '#a0277f')])(
  'Should create a category successfully',
  async (category: Category) => {
    const id = await categoryRepository.save(category);
    const response = await categoryRepository.getById(id);
    expect(response).toEqual({
      id,
      name: category.name,
      color: category.color,
    });
  }
);

it('Should return an category by id', async () => {
  const category = await categoryRepository.getById(2);
  expect(category).toEqual({
    id: 2,
    name: 'Educação',
    color: '#a0277f',
  });
});

it('Should return an list of categories', async () => {
  const categories = await categoryRepository.getAll();
  expect(categories.length).toBe(2);
});

test('Should edit a category successfully', async () => {
  const categoryToEdit = new Category('Educação', '#682352', 2);
  const id = await categoryRepository.save(categoryToEdit);
  const categoryAfterEdit = await categoryRepository.getById(id);
  expect(categoryAfterEdit).toEqual({
    id: 2,
    name: 'Educação',
    color: '#682352',
  });
});

test.each([
  new Category('Educação', '#d3d3d3'),
  new Category('Educação', '#ffa500', 1),
])(
  "Should throw an error when category's name is repeated",
  async (category: Category) => {
    await expect(() => categoryRepository.save(category)).rejects.toThrow(
      new ValidationError(
        'Category already exists with this name or color',
        422
      )
    );
  }
);

test('Should delete a category succesfully', async () => {
  await categoryRepository.delete(1);
  const category = await categoryRepository.getById(1);
  expect(category).toBeNull();
});
