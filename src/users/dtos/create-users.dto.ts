import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUsersDto {
  @ApiProperty({
    description: 'Enter your first name',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  firstName: string;

  @ApiPropertyOptional({
    description: 'Enter your last name',
    example: 'Doe',
  })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(100)
  lastName?: string;

  @ApiProperty({
    description: 'Enter your secret password',
  })
  @IsString()
  @MinLength(3)
  @Matches(
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#@$?])[a-zA-Z0-9#@$?]{8,}$/,
    {
      message:
        'Minimum 3 characters long, at least 8 characters long, at least one number and alpha numerics',
    },
  )
  password: string;

  @ApiProperty({
    description: 'Enter your email address',
    example: 'john.doe@example.com',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
