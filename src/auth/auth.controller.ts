import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import { ApiTags } from '@nestjs/swagger';
import { SigninDto } from './dtos/signin.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  public async signIn(@Body() signInDto: SigninDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('register')
  public userRegister(@Body() registerRequest: any) {
    console.log(registerRequest);
  }
}
