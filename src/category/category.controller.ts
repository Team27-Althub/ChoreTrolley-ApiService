import { Controller, Get, Param } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly _categoryService: CategoryService) {}

  @Get('/')
  async getAllCategories() {
    return await this._categoryService.findAllCategories();
  }

  @Get('/grocery-categories')
  async getAllGroceryCategories() {
    return await this._categoryService.findAllGroceryCategories()
  }

  @Get('/:id')
  async getSingleCategory(@Param('id') id: string) {
    return await this._categoryService.getSingleCategory(+id);
  }
}
