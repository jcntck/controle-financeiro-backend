import Category from '../core/entity/Category';
import CategoryRepository from '../core/repository/CategoryRepository';
import ValidationError from '../helpers/ValidationError';

type CategoryDTO = {
  name: string;
  color: string;
};

export default class CategoryController {
  constructor(readonly categoryRepository: CategoryRepository) {}

  async get(): Promise<Category[]> {
    return this.categoryRepository.getAll();
  }

  async getById(id: string): Promise<Category | null> {
    if (!Number(id)) throw new ValidationError('Id provided must be a number', 400);
    return this.categoryRepository.getById(Number(id));
  }

  async post(body: CategoryDTO): Promise<{ id: number }> {
    const category = new Category(body.name, body.color);
    return { id: await this.categoryRepository.save(category) };
  }

  async put(id: string, body: CategoryDTO): Promise<void> {
    if (!Number(id)) throw new ValidationError('Id provided must be a number', 400);
    const category = new Category(body.name, body.color, Number(id));
    await this.categoryRepository.save(category);
  }

  async delete(id: string): Promise<void> {
    if (!Number(id)) throw new ValidationError('Id provided must be a number', 400);
    await this.categoryRepository.delete(Number(id));
  }
}
