import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CategoryService } from '../../category/category.service';
import { Category } from '../../category/entities/category.entity';
import { Service } from '../entities/service.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { GetServiceFilterQueryDto } from '../dtos/GetServicePaginationQueryDto';
import { PaginationProvider } from '../../common/pagination/providers/pagination.provider';
import { Pagination } from '../../common/pagination/interfaces/pagination.interface';
import { CreateServiceDto } from '../dtos/CreateServiceDto';
import { CreateServiceProviderDto } from '../dtos/CreateServiceProviderDto';

@Injectable()
export class ServicesProvider {
  constructor(
    @Inject(forwardRef(() => CategoryService))
    private readonly _categoryService: CategoryService,
    @InjectRepository(Service)
    private readonly _serviceRepository: Repository<Service>,
    private readonly _paginationProvider: PaginationProvider,
  ) {}

  async findAllCategories(): Promise<Category[]> {
    return this._categoryService.findAllCategories();
  }

  async getServicesByPagination(
    filterQuery: GetServiceFilterQueryDto,
  ): Promise<Pagination<Service>> {
    return await this._paginationProvider.paginateQuery(
      {
        limit: filterQuery.limit,
        page: filterQuery.page,
      },
      this._serviceRepository,
    );
  }

  async createService(dto: CreateServiceDto) {
    const service = this._serviceRepository.create(dto);
    return await this._serviceRepository.save(service);
  }

  async getSingleService(id: number) {
    try {
      return await this._serviceRepository.findOneBy({ id });
    } catch (e) {
      console.log('singleServiceError:', e.message);
      throw new NotFoundException('Service not found.');
    }
  }

  async createServiceProvider(dto: CreateServiceProviderDto) {
    const existingProvider = await this._serviceRepository.findOneBy({
      id: dto.id,
    });
    if (existingProvider) {
      throw new BadRequestException('Already existing provider');
    }
    const serviceProvider = this._serviceRepository.create(dto);
    return this._serviceRepository.save(serviceProvider);
  }
}
