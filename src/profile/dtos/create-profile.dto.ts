import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateProfileDto {
  @ApiProperty({ example: 'Ade' })
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Olu' })
  @IsString()
  lastName: string;

  // @ApiProperty({ example: 'Home-owner' })
  // @IsOptional()
  // @IsString()
  // role?: string;

  // @ApiProperty({ example: 5.0 })
  // @IsOptional()
  // @IsNumber()
  // rating?: number;

  // @ApiProperty({ example: 18 })
  // @IsOptional()
  // @IsNumber()
  // reviewCount?: number;

  @ApiProperty({ example: '123 Shodeinde Close VI, Lagos' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({ example: 'Lagos' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ example: 'Lagos' })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({ example: '0813468972' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ example: 'https://example.com/profile.jpg' })
  @IsOptional()
  @IsUrl()
  profileImageUrl?: string;

  @ApiProperty({ example: 1, description: 'User ID this profile belongs to' })
  userId: number;
}
