import { IsNumber, IsOptional, IsString } from 'class-validator';
import {
  ApiProperty,
  ApiPropertyOptional,
  IntersectionType,
} from '@nestjs/swagger';
import { PaginationQueryDto } from '../../common/interceptors/pagination/dtos/pagination-query.dto';

class GetServicePaginationQueryDto {
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({
    description: 'Category Id of the Service',
  })
  category?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    example: 'plumbing',
    description: 'Search keyword for filtering services',
  })
  search?: string;

  @ApiProperty({
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
    description: 'Service Type of Service',
  })
  @IsOptional()
  @IsString()
  serviceType?: string;
}

export class GetServiceFilterQueryDto extends IntersectionType(
  GetServicePaginationQueryDto,
  PaginationQueryDto,
) {}
