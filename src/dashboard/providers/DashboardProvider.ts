import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CategoryService } from '../../category/category.service';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from '../../services/entities/service.entity';
import { ServiceProvider } from '../../services/entities/service-provider.entity';

@Injectable()
export class DashboardProvider {
  constructor(
    @Inject(forwardRef(() => CategoryService))
    private readonly _categoryService: CategoryService,
    /**
     *
     */
    @InjectRepository(Service)
    private readonly _service: Repository<Service>,
    /**
     *
     */
    @InjectRepository(ServiceProvider)
    private readonly _serviceProvider: Repository<ServiceProvider>,
  ) {}

  async findServicesByLimit(limit: number) {
    return this._service.find({
      take: limit,
    });
  }

  async findServiceProviderByLimit(limit: number) {
    return this._serviceProvider.find({
      take: limit,
    });
  }

  async findCategoriesByLimit(limit: number) {
    return this._categoryService.findCategoriesByLimit(limit);
  }
}
