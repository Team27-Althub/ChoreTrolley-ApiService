import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceProviderDto } from './CreateServiceProviderDto';

export class UpdateServiceProviderDto extends PartialType(
  CreateServiceProviderDto,
) {}
