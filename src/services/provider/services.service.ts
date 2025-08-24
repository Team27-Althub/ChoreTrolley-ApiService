import { Injectable } from '@nestjs/common';
import { ServicesProvider } from './services-provider';

@Injectable()
export class ServicesService {
  constructor(private readonly _serviceProvider: ServicesProvider) {}

  async getAllCategories() {
    return this._serviceProvider.findAllCategories();
  }
}
