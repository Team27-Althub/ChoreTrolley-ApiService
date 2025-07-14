import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags
} from "@nestjs/swagger";
import { SigninDto } from './dtos/signin.dto';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { CreateUsersDto } from '../users/dtos/create-users.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { SignInResponseDto } from '../users/dtos/response.dto';

@Controller('auth')
@ApiTags('Auth Section')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  @Auth(AuthType.None)
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClassSerializerInterceptor)
  @ApiOperation({ summary: 'Use endpoint to sign in' })
  @ApiOkResponse({
    description: 'User Signed in successfully',
    type: SignInResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad payload sent',
  })
  public async signIn(@Body() signInDto: SigninDto) {
    return this.authService.signIn(signInDto);
  }

  @Post('refresh-token')
  @Auth(AuthType.None)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Use endpoint to request fresh token' })
  @ApiOkResponse({
    description: 'Fresh token was generated successfully',
    type: SignInResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad payload sent',
  })
  public async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto);
  }

  @Auth(AuthType.None)
  @Post('register')
  @ApiOperation({ summary: 'Use endpoint to register new user' })
  @ApiCreatedResponse({
    description: 'User successfully registered',
  })
  @ApiBadRequestResponse({
    description: 'Bad payload sent',
  })
  public userRegister(@Body() registerRequest: CreateUsersDto) {
    return this.authService.signUp(registerRequest);
  }
}
