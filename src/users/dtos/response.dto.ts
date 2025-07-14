import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { User } from '../providers/user.entity';

export class CreateUserResponseDto extends User {}

export class SignInResponseDto {
  @ApiProperty()
  accessToken: string;

  @ApiPropertyOptional()
  refreshToken: string;
}
