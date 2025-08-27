import { Inject, Injectable } from '@nestjs/common';
import { ObjectLiteral, Repository, SelectQueryBuilder } from 'typeorm';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';
import { Pagination } from '../interfaces/pagination.interface';
import { GetServiceFilterQueryDto } from '../../../services/dtos/GetServicePaginationQueryDto';

@Injectable()
export class PaginationProvider {
  constructor(
    @Inject(REQUEST)
    private readonly request: Request,
  ) {}

  async paginateQuery<T extends ObjectLiteral>(
    pagingQuery: GetServiceFilterQueryDto,
    repository: Repository<T>,
  ): Promise<Pagination<T>> {
    const { page, limit, search, category, minPrice, maxPrice } = pagingQuery;

    const baseUrl =
      this.request.protocol + '://' + this.request.get('host') + '/';

    const newUrl = new URL(this.request.url, baseUrl);

    const alias = repository.metadata.tableName;

    const queryBuilder = createQueryBuilder(repository);

    /*for (const relation of relations) {
      queryBuilder.leftJoinAndSelect(`${alias}.${relation}`, relation);
    }*/

    repository.metadata.relations.forEach((relation) => {
      queryBuilder.leftJoinAndSelect(
        `${alias}.${relation.propertyName}`,
        relation.propertyName,
      );
    });

    if (search) {
      queryBuilder.andWhere(
        `${alias}.title ILIKE :search OR ${alias}.description ILIKE :search`,
        { search: `%${search}%` },
      );
    }

    if (category) {
      queryBuilder.andWhere(`${alias}.categoryId = :categoryId`, { category });
    }

    if (minPrice !== undefined) {
      queryBuilder.andWhere(`${alias}.price >= :minPrice`, { minPrice });
    }

    if (maxPrice !== undefined) {
      queryBuilder.andWhere(`${alias}.price <= :maxPrice`, { maxPrice });
    }

    queryBuilder.skip((page - 1) * limit).take(limit);

    const [results, totalItems] = await queryBuilder.getManyAndCount();

    // const totalItems = await repository.count();
    const totalPages = Math.ceil(totalItems / limit);
    const nextPage = page < totalPages ? page + 1 : page;

    const prevPage = page > 1 ? page - 1 : page;

    /*const results = await repository.find({
      skip: (page - 1) * limit,
      take: limit,
    });*/

    return {
      data: results,
      meta: {
        itemsPerPage: limit,
        totalItems: totalItems,
        currentPage: page,
        totalPages: totalPages,
      },
      links: {
        first: `${newUrl.origin}${newUrl.pathname}?limit=${pagingQuery.limit}&page=1`,
        last: `${newUrl.origin}${newUrl.pathname}?limit=${pagingQuery.limit}&page=${totalPages}`,
        current: `${newUrl.origin}${newUrl.pathname}?limit=${pagingQuery.limit}&page=${pagingQuery.page}`,
        next: `${newUrl.origin}${newUrl.pathname}?limit=${pagingQuery.limit}&page=${nextPage}`,
        previous: `${newUrl.origin}${newUrl.pathname}?limit=${pagingQuery.limit}&page=${prevPage}`,
        // prev: prevPage ? `${newUrl.pathname}?page=${prevPage}` : null,
        // next: nextPage ? `${newUrl.pathname}?page=${nextPage}` : null,
      },
    };
  }
}

export function createQueryBuilder<T>(
  repository: Repository<T>,
): SelectQueryBuilder<T> {
  const alias = repository.metadata.tableName;
  return repository.createQueryBuilder(alias);
}

export function addJoinsRecursively<T>(
  queryBuilder: SelectQueryBuilder<T>,
  alias: string,
  repository: Repository<T>,
  maxDepth = 1,
  currentDepth = 0,
  visited = new Set<string>(),
) {
  if (currentDepth >= maxDepth || visited.has(alias)) return;
  visited.add(alias);

  repository.metadata.relations.forEach((relation) => {
    const relationAlias = `${alias}_${relation.propertyName}`;
    queryBuilder.leftJoinAndSelect(
      `${alias}.${relation.propertyName}`,
      relationAlias,
    );

    // Recurse into nested relations
    const target = relation.inverseEntityMetadata.target;
    addJoinsRecursively(
      queryBuilder as any,
      relationAlias,
      repository.manager.getRepository(target),
      maxDepth,
      currentDepth + 1,
      visited,
    );
  });
}
