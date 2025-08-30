import {
  BadRequestException,
  ForbiddenException,
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
import { ServiceProvider } from '../entities/service-provider.entity';
import { UpdateServiceDto } from '../dtos/UpdateServiceDto';
import { UpdateServiceProviderDto } from '../dtos/UpdateServiceProviderDto';

@Injectable()
export class ServicesProvider {
  constructor(
    @Inject(forwardRef(() => CategoryService))
    private readonly _categoryService: CategoryService,
    /**
     *
     */
    @InjectRepository(Service)
    private readonly _serviceRepository: Repository<Service>,
    /**
     *
     */
    @InjectRepository(ServiceProvider)
    private readonly _serviceProviderRepository: Repository<ServiceProvider>,
    /**
     *
     */
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

  async createService(dto: CreateServiceDto, userId: number) {
    const serviceProvider = await this._serviceProviderRepository.findOneBy({
      id: userId,
    });
    const service = this._serviceRepository.create({ ...dto, serviceProvider });
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

  async updateProvidedService(dto: UpdateServiceDto, userId: number) {
    return await this._serviceRepository.manager.transaction(
      async (transactionalEntityManager) => {
        // 1. Validate related entities
        const provider = await transactionalEntityManager.findOne(
          ServiceProvider,
          {
            where: { id: userId },
          },
        );

        if (!provider) {
          throw new BadRequestException(`Service Provider not found`);
        }

        const category = await transactionalEntityManager.findOne(Category, {
          where: { id: dto.categoryId },
        });

        if (!category) {
          throw new BadRequestException(`Category not found`);
        }

        // 2. Preload service (merge existing + dto)
        const service = await transactionalEntityManager.preload(Service, {
          id: userId,
          ...dto,
        });

        if (!service) {
          throw new BadRequestException(`Unable to update with ${dto.title}`);
        }

        // 3. Persist safely inside transaction
        return await transactionalEntityManager.save(Service, service);
      },
    );
  }

  async createServiceProvider(dto: CreateServiceProviderDto, userId: number) {
    const existingProvider = await this._serviceProviderRepository.findOneBy({
      id: userId,
    });
    if (existingProvider) {
      throw new BadRequestException('Already existing provider');
    }
    const serviceProvider = this._serviceProviderRepository.create(dto);
    return this._serviceProviderRepository.save(serviceProvider);
  }

  async updateServiceProvider(dto: UpdateServiceProviderDto, id: number) {
    const existingProvider = await this._serviceProviderRepository.findOneBy({
      id: id,
    });
    if (!existingProvider) {
      throw new BadRequestException('Service Provider not found');
    }
    // Merge new values into existing provider
    const updatedProvider = this._serviceProviderRepository.merge(
      existingProvider,
      dto,
    );

    return await this._serviceProviderRepository.save(updatedProvider);
  }

  async deleteProvidedService(userId: number, serviceId: number) {
    const existingService = await this._serviceRepository.findOne({
      where: {
        id: serviceId,
      },
      relations: ['serviceProvider'],
    });
    if (!existingService) {
      throw new NotFoundException('Service not found');
    }
    if (existingService.serviceProvider.id !== userId) {
      throw new ForbiddenException(
        'You are not allowed to delete this service',
      );
    }
    await this._serviceRepository.remove(existingService);
  }
}
