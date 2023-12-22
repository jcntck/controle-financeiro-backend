import Category from "../entity/Category";

export default interface CategoryRepository {
  getAll(): Promise<Category[]>;
  getById(id: number): Promise<Category | null>;
  count(): Promise<number>;
  save(category: Category): Promise<number>;
  delete(id: number): Promise<void>;
}
