import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../common/interceptors/pagination/dtos/pagination-query.dto';

class GetGroceryPaginationQuery {
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    description: 'Category Id of the Service',
  })
  category?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'fresh tomatoes',
    description: 'Search keyword for filtering services',
  })
  search?: string;

  @ApiPropertyOptional({
    description: 'Rating number of service',
  })
  @IsOptional()
  @IsNumber()
  rating?: number;

  @ApiPropertyOptional({
    description: 'Minimum price range of service',
  })
  @IsOptional()
  @IsNumber()
  minPrice?: number;

  @ApiPropertyOptional({
    description: 'Maximum price range of service',
  })
  @IsOptional()
  @IsNumber()
  maxPrice?: number;

  @ApiPropertyOptional({
    description: 'Grocery Type of Service',
  })
  @IsOptional()
  @IsString()
  groceryType?: string;
}

export class GetGroceryFilterQueryDto extends IntersectionType(
  GetGroceryPaginationQuery,
  PaginationQueryDto,
) {}
