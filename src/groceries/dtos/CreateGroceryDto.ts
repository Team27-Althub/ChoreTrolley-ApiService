import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from "class-transformer";

export class CreateGroceryDto {
  @IsString()
  @ApiProperty({ description: 'Grocery name', example: 'Fresh Mango' })
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @ApiProperty({
    description: 'Category Id',
    example: 1,
  })
  category: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Detailed description of the grocery',
    example: 'Fresh mango with no preservatives',
  })
  description: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @ApiProperty({
    description: 'Amount of the grocery',
    example: '15000',
  })
  price: number;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @ApiProperty({
    description: 'Indicates if grocery is sponsored',
    example: 'true or false',
  })
  sponsored?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  @ApiProperty({
    description: 'Is in stock or not',
    example: 'true or false',
  })
  is_available: boolean;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({
    description: 'Ratings for grocery',
    example: '3',
  })
  rating?: number;

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Currency used for grocery',
    example: 'Naira',
  })
  currency?: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Unit to measure',
    example: 'kg',
  })
  unit: string; // e.g. "(kg, pack, litre)"

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Grocery type',
    example: 'organic',
  })
  groceryType?: string; // e.g. organic or non-organic or GMO

  @IsOptional()
  @IsString()
  @ApiProperty({
    description: 'Image url for the service',
    example: 'https://image-url.com',
  })
  imageUrl?: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @ApiProperty({
    description: 'Grocery provider id',
    example: '2',
  })
  providerId: number;
}
