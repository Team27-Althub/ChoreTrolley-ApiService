import { PartialType } from '@nestjs/mapped-types';
import { CreateUsersDto } from './create-users.dto';

export class PatchUsersDto extends PartialType(CreateUsersDto) {}
