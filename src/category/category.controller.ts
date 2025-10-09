import { Controller, Get, Param } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ApiTags } from "@nestjs/swagger";

@Controller('category')
@ApiTags('Category')
export class CategoryController {
  constructor(private readonly _categoryService: CategoryService) {}

  @Get('/service')
  async getAllCategories() {
    return await this._categoryService.findAllCategories();
  }

  @Get('/grocery')
  async getAllGroceryCategories() {
    return await this._categoryService.findAllGroceryCategories()
  }

  @Get('/:id')
  async getSingleCategory(@Param('id') id: string) {
    return await this._categoryService.getSingleCategory(+id);
  }
}
