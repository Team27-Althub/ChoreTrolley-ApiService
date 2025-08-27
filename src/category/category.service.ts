import { Injectable } from '@nestjs/common';
import { CategoryProvider } from './providers/category-provider';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoryService {
  constructor(private readonly _categoryProvider: CategoryProvider) {}

  async findAllCategories() {
    return await this._categoryProvider.findAll();
  }

  async findCategoriesByLimit(limit: number) {
    return await this._categoryProvider.findCategoriesByLimit(limit);
  }

  async getSingleCategory(categoryId: number): Promise<Category> {
    return await this._categoryProvider.findOneById(categoryId);
  }
}
