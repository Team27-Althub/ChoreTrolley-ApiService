import { Injectable } from '@nestjs/common';
import { GroceriesProvider } from './groceries-provider';
import { GetGroceryFilterQueryDto } from '../dtos/GetGroceryPaginationQuery';
import { CreateGroceryDto } from '../dtos/CreateGroceryDto';
import { UpdateGroceryDto } from '../dtos/UpdateGroceryDto';

@Injectable()
export class GroceriesService {
  constructor(private readonly _groceryProvider: GroceriesProvider) {}

  async getAllGroceries(filterQuery: GetGroceryFilterQueryDto) {
    return this._groceryProvider.getAllGroceriesByPagination(filterQuery);
  }

  async createGrocery(createGroceryDto: CreateGroceryDto, userId: number) {
    return this._groceryProvider.createGroceryAction(createGroceryDto, userId);
  }

  async findOneGrocery(id: number) {
    return this._groceryProvider.findOneGroceryAction(id);
  }

  async updateGrocery(userId: number, dto: UpdateGroceryDto) {
    return this._groceryProvider.updateGroceryAction(dto, userId);
  }

  async deleteGrocery(userID: number, groceryId: number) {
    return this._groceryProvider.deleteGroceryAction(userID, groceryId);
  }
}
