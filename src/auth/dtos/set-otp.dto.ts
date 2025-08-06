import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SetOtpDto {
  @ApiProperty()
  @IsNotEmpty()
  expiresIn: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  pin: string;
}
