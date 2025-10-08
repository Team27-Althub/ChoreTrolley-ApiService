import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryProvider } from './providers/category-provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { CategoryController } from './category.controller';
import { GroceryCategory } from "./entities/grocery.category.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Category, GroceryCategory])],
  providers: [CategoryService, CategoryProvider],
  exports: [CategoryService],
  controllers: [CategoryController],
})
export class CategoryModule {}
