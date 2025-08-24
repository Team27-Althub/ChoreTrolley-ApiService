import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CategoryService } from '../../category/category.service';
import { Category } from '../../category/entities/category.entity';

@Injectable()
export class ServicesProvider {
  constructor(
    @Inject(forwardRef(() => CategoryService))
    private readonly _categoryService: CategoryService,
  ) {}

  async findAllCategories(): Promise<Category[]> {
    return this._categoryService.findAllCategories();
  }
}
