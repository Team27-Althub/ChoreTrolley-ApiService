import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateServiceProviderDto {
  @ApiProperty({
    description: 'user id',
  })
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @ApiProperty({
    description: 'Bio description',
    example: 'I am a good description of what i do',
  })
  @IsNotEmpty()
  @IsString()
  bio?: string;

  @ApiProperty({
    description: 'Skills',
    example: ['plumbing', 'electrical', 'cleaning'],
  })
  @IsArray()
  @IsOptional()
  skills?: string[];

  @ApiProperty({
    description: 'Certifications',
    example: ['ISO-9001', 'Certificate of Completion'],
  })
  @IsArray()
  @IsOptional()
  certifications?: string[];

  @ApiProperty({
    description: 'Available Hours',
    example:
      '{\n' +
      '  "monday": [\n' +
      '    "09:00-12:00",\n' +
      '    "14:00-18:00"\n' +
      '  ],\n' +
      '  "tuesday": [\n' +
      '    "09:00-15:00"\n' +
      '  ]\n' +
      '}',
  })
  @IsObject()
  @IsOptional()
  available_hours?: Record<string, string[]>;
}
