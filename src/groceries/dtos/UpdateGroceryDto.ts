import { PartialType } from '@nestjs/mapped-types';
import { CreateGroceryDto } from './CreateGroceryDto';

export class UpdateGroceryDto extends PartialType(CreateGroceryDto) {}
