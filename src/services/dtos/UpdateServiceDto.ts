import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceDto } from './CreateServiceDto';

export class UpdateServiceDto extends PartialType(CreateServiceDto) {}
