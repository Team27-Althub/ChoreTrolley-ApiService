import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @ApiProperty({ example: 'OldPassword123' })
  @IsString()
  oldPassword: string;

  @ApiProperty({ example: 'NewStrongPassword456' })
  @IsString()
  @MinLength(6)
  newPassword: string;
}
