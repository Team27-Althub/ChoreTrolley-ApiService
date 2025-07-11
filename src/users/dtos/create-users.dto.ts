import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUsersDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  firstName: string;

  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(100)
  lastName?: string;

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

  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
