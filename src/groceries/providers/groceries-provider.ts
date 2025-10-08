import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    NotFoundException
} from "@nestjs/common";
import { Repository } from "typeorm";
import { Grocery } from "../entities/Grocery";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateGroceryDto } from "../dtos/CreateGroceryDto";
import { PaginationProvider } from "../../common/pagination/providers/pagination.provider";
import { GetGroceryFilterQueryDto } from "../dtos/GetGroceryPaginationQuery";
import { UpdateServiceDto } from "../../services/dtos/UpdateServiceDto";
import { ServiceProvider } from "../../services/entities/service-provider.entity";
import { Category } from "../../category/entities/category.entity";
import { GroceryCategory } from "../../category/entities/grocery.category.entity";

@Injectable()
export class GroceriesProvider {
    constructor(
            @InjectRepository(Grocery)
            private readonly _groceryRepository: Repository<Grocery>,
            @InjectRepository(ServiceProvider)
            private readonly _serviceProvider: Repository<ServiceProvider>,
            @InjectRepository(GroceryCategory)
            private readonly _categoryRepository: Repository<GroceryCategory>,
            /**
             *
             */
            private readonly _paginationProvider: PaginationProvider
    ) {
    }

    async createGroceryAction(dto: CreateGroceryDto, userId: number) {
        const serviceProvider = await this._serviceProvider.findOneBy({
            id: userId
        });

        const category = await this._categoryRepository.findOneBy({ id: dto.category });
        if (!category) {
            throw new NotFoundException("Category not found");
        }

        const existingGrocery = await this._groceryRepository.findOneBy({
            name: dto.name
        });

        if (existingGrocery) {
            throw new BadRequestException("Title already exists");
        }
        const grocery = this._groceryRepository.create({ ...dto, category, serviceProvider });
        return await this._groceryRepository.save(grocery);
    }

    async getAllGroceriesByPagination(filterQuery: GetGroceryFilterQueryDto) {
        return await this._paginationProvider.paginateQuery(
                {
                    limit: filterQuery.limit,
                    page: filterQuery.page
                },
                this._groceryRepository
        );
    }

    async updateGroceryAction(dto: UpdateServiceDto, userId: number) {
        return await this._groceryRepository.manager.transaction(
                async (transactionalEntityManager) => {
                    // 1. Validate related entities
                    const provider = await transactionalEntityManager.findOne(
                            ServiceProvider,
                            {
                                where: { id: userId }
                            }
                    );

                    if (!provider) {
                        throw new BadRequestException(`Service Provider not found`);
                    }

                    const category = await transactionalEntityManager.findOne(Category, {
                        where: { id: dto.categoryId }
                    });

                    if (!category) {
                        throw new BadRequestException(`Category not found`);
                    }

                    // 2. Preload service (merge existing + dto)
                    const grocery = await transactionalEntityManager.preload(Grocery, {
                        id: userId,
                        ...dto
                    });

                    if (!grocery) {
                        throw new BadRequestException(`Unable to update with ${dto.title}`);
                    }

                    // 3. Persist safely inside transaction
                    return await transactionalEntityManager.save(Grocery, grocery);
                }
        );
    }

    async findOneGroceryAction(id: number) {
        return await this._groceryRepository.findOneBy({ id });
    }

    async deleteGroceryAction(userId: number, groceryId: number) {
        const existingService = await this._groceryRepository.findOne({
            where: {
                id: groceryId
            },
            relations: ["serviceProvider"]
        });
        if (!existingService) {
            throw new NotFoundException("Grocery not found");
        }
        if (existingService.serviceProvider.id !== userId) {
            throw new ForbiddenException(
                    "You are not allowed to delete this service"
            );
        }
        await this._groceryRepository.remove(existingService);
    }
}
