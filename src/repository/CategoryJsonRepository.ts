import fs from 'node:fs';

import Category from '../core/entity/Category';
import CategoryRepository from '../core/repository/CategoryRepository';
import ValidationError from '../helpers/ValidationError';

export default class CategoryJsonRepository implements CategoryRepository {
  private categories: Map<number, Category> = new Map();

  constructor(readonly databasePath: string) {
    this.initDatabase();
  }

  async getAll(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getById(id: number): Promise<Category | null> {
    this.loadData();
    return this.categories.get(id) || null;
  }

  async count(): Promise<number> {
    this.loadData();
    return this.categories.size;
  }

  async save(category: Category): Promise<number> {
    if (!category.id) {
      category.id = this.generateId();
    }
    if (this.fieldIsNotUnique(category, 'name') || this.fieldIsNotUnique(category, 'color')) {
      throw new ValidationError('Category already exists with this name or color', 422);
    }
    this.categories.set(category.id, category);
    this.writeData();
    return category.id;
  }

  async delete(id: number): Promise<void> {
    this.categories.delete(id);
    this.writeData();
  }

  private initDatabase() {
    const databaseExists = fs.existsSync(this.databasePath);

    if (!databaseExists) {
      fs.writeFileSync(this.databasePath, JSON.stringify([]));
    }

    this.loadData();
  }

  private loadData() {
    const rawContent = JSON.parse(fs.readFileSync(this.databasePath, { encoding: 'utf-8' }));
    for (const item of rawContent) {
      if (!this.categories.has(item.id)) this.categories.set(item.id, new Category(item.name, item.color, item.id));
    }
  }

  private generateId(): number {
    if (!this.categories.size) return 1;
    const [biggestId] = Array.from(this.categories.values()).sort((a, b) => {
      if (a.id! > b.id!) return -1;
      if (a.id! < b.id!) return 1;
      return 0;
    });
    return biggestId.id! + 1;
  }

  private writeData(): void {
    const data = Array.from(this.categories.values());
    fs.writeFileSync(this.databasePath, JSON.stringify(data, null, 2));
  }

  private fieldIsNotUnique(category: Category, field: string) {
    const key = field as keyof Category;
    const data = Array.from(this.categories.values());
    if (!data.length) return false;
    return data.some((value) => {
      const isEqual = value[key]?.toString().localeCompare(category[key]!.toString(), 'pt-BR', { sensitivity: 'base' }) === 0;
      return isEqual && category.id !== value.id;
    });
  }
}
