import { Injectable } from '@nestjs/common';
import { ServicesProvider } from './services-provider';
import { GetServiceFilterQueryDto } from '../dtos/GetServicePaginationQueryDto';
import { CreateServiceDto } from '../dtos/CreateServiceDto';
import { CreateServiceProviderDto } from '../dtos/CreateServiceProviderDto';
import { UpdateServiceDto } from '../dtos/UpdateServiceDto';
import { UpdateServiceProviderDto } from '../dtos/UpdateServiceProviderDto';

@Injectable()
export class ServicesService {
  constructor(private readonly _serviceProvider: ServicesProvider) {}

  async getAllCategories() {
    return this._serviceProvider.findAllCategories();
  }

  async getPaginatedService(filterQuery: GetServiceFilterQueryDto) {
    return this._serviceProvider.getServicesByPagination(filterQuery);
  }

  async getSingleService(id: number) {
    return this._serviceProvider.getSingleService(id);
  }

  async createService(createService: CreateServiceDto) {
    return this._serviceProvider.createService(createService);
  }

  async createServiceProvider(dto: CreateServiceProviderDto) {
    return this._serviceProvider.createServiceProvider(dto);
  }

  async updateProvidedService(dto: UpdateServiceDto, id: number) {
    return this._serviceProvider.updateProvidedService(dto, id);
  }

  async updateServiceProvider(dto: UpdateServiceProviderDto, id: number) {
    return this._serviceProvider.updateServiceProvider(dto, id);
  }

  async deleteProvidedService(userId: number, serviceId: number) {
    return this._serviceProvider.deleteProvidedService(userId, serviceId);
  }
}
