import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional, IntersectionType } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../common/interceptors/pagination/dtos/pagination-query.dto';

export class OrderPaginationQuery {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'fresh tomatoes',
    description: 'Search keyword for filtering services',
  })
  search?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'Pending',
    description: 'Status for filtering orders',
  })
  status?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'Card',
    description: 'Payment method for filtering orders',
  })
  paymentMethod?: string;
}

export class OrderFilterQueryDto extends IntersectionType(
  OrderPaginationQuery,
  PaginationQueryDto,
) {}
