import { IsOptional, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  @ApiProperty({
    description: 'Page number of items',
  })
  page?: number = 1;

  @IsOptional()
  @IsPositive()
  @ApiProperty({
    description: 'Limit of items',
  })
  limit?: number = 10;
}
