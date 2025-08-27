import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateServiceDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Service name', example: 'Plumber Painter' })
  title: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Detailed description of the service',
    example: 'Fix leaking pipes and taps',
  })
  description?: string;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Image url for the service',
    example: 'https://image-url.com',
  })
  imageUrl?: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'Amount of the service',
    example: '15000',
  })
  price: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    description: 'Price units for service',
    example: 'e.g: hr,item,visit,meal,session,quote',
  })
  priceUnit: string; // e.g. "hr", "item", "visit", "meal", "session", "quote"

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    description: 'Indicates if the service is sponsored',
    example: 'true or false',
  })
  sponsored?: boolean;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'Category Id',
    example: 'e.g 1',
  })
  categoryId: number;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'Service provider id',
    example: '2',
  })
  providerId: number;

  @IsNotEmpty()
  @IsEnum(['full-time', 'part-time', 'on-demand'])
  @ApiProperty({
    description: 'Service type',
    example: 'on-demand',
  })
  serviceType: 'full-time' | 'part-time' | 'on-demand';
}
