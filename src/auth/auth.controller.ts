import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { ApiTags } from '@nestjs/swagger';
import { SigninDto } from './dtos/signin.dto';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { CreateUsersDto } from '../users/dtos/create-users.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @Auth(AuthType.None)
  @HttpCode(HttpStatus.OK)
  public async signIn(@Body() signInDto: SigninDto) {
    return this.authService.signIn(signInDto);
  }

  @Auth(AuthType.None)
  @Post('register')
  public userRegister(@Body() registerRequest: CreateUsersDto) {
    return this.authService.signUp(registerRequest);
  }
}
