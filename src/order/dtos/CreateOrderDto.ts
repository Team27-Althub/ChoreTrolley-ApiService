import {
  IsArray,
  IsEnum, IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString
} from "class-validator";
import {
  ContractType,
  PaymentMethod,
  ShippingMethod,
} from '../entities/order.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @IsNumber()
  @IsOptional()
  userId: number;

  @IsNumber()
  @IsOptional()
  addressId?: number;

  @IsString()
  @IsOptional()
  address?: string;

  @IsArray()
  @IsOptional()
  @ApiProperty({ example: [1, 2, 3], required: false })
  @IsInt({ each: true })
  groceries?: number[]; // array of grocery IDs

  @IsArray()
  @IsOptional()
  @ApiProperty({ example: [4], required: false })
  @IsInt({ each: true })
  services?: number[]; // array of service IDs

  @ApiProperty({
      example: 20,
      required: false,
      description: 'Booking ID if order is for a booked service'
  })
  @IsOptional()
  @IsNumber()
  bookingId?: number;

  @IsEnum(ShippingMethod)
  @IsOptional()
  @ApiProperty()
  shippingMethod?: ShippingMethod;

  @IsEnum(ContractType)
  @IsOptional()
  @ApiProperty()
  contractType?: ContractType;

  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  @ApiProperty()
  paymentMethod: PaymentMethod;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  subtotal: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  tax: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  shipping: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  total: number;
}
