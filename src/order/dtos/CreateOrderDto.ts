import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  ContractType,
  PaymentMethod,
  ShippingMethod,
} from '../entities/order.entity';

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
  groceries?: string[]; // array of grocery IDs

  @IsArray()
  @IsOptional()
  services?: string[]; // array of service IDs

  @IsEnum(ShippingMethod)
  @IsOptional()
  shippingMethod?: ShippingMethod;

  @IsEnum(ContractType)
  @IsOptional()
  contractType?: ContractType;

  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  paymentMethod: PaymentMethod;

  @IsNumber()
  @IsNotEmpty()
  subtotal: number;

  @IsNumber()
  @IsNotEmpty()
  tax: number;

  @IsNumber()
  @IsNotEmpty()
  shipping: number;

  @IsNumber()
  @IsNotEmpty()
  total: number;
}
