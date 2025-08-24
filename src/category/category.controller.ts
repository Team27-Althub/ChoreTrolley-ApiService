import { Controller, Get, Param } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly _categoryService: CategoryService) {}

  @Get('/')
  async getAllCategories() {
    return await this._categoryService.findAllCategories();
  }

  @Get('/:id')
  async getSingleCategory(@Param('id') id: string) {
    return await this._categoryService.getSingleCategory(+id);
  }
}
