import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { GroceryCategory } from "../entities/grocery.category.entity";

@Injectable()
export class CategoryProvider {
  constructor(
    @InjectRepository(Category)
    private readonly _repository: Repository<Category>,
    @InjectRepository(GroceryCategory)
    private readonly _groceryRepository: Repository<GroceryCategory>,
  ) {}

  async findAll(): Promise<Category[]> {
    return this._repository.find();
  }

  async findCategoriesByLimit(limit: number): Promise<Category[]> {
    return this._repository.find({
      take: limit,
    });
  }

  async findOneById(id: number): Promise<Category> {
    try {
      return await this._repository.findOneBy({ id: id });
    } catch (e) {
      throw new NotFoundException(e);
    }
  }

  async findAllGroceries(limit?: number): Promise<GroceryCategory[]> {
    return this._groceryRepository.find({
      take: limit,
    });
  }
}
