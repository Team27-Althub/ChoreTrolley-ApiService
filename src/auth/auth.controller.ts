import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Inject,
  Patch,
  Post,
  Req,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './providers/auth.service';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { SigninDto } from './dtos/signin.dto';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { CreateUsersDto } from '../users/dtos/create-users.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { SignInResponseDto } from '../users/dtos/response.dto';
import { RequestTokenDto } from '../users/dtos/request-token.dto';
import jwtConfig from './config/jwtConfig';
import { ConfigType } from '@nestjs/config';
import JwtConfig from './config/jwtConfig';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdatePasswordDto } from './dtos/UpdatePasswordDto';

@Controller('auth')
@Auth(AuthType.None)
@ApiTags('Auth Module')
export class AuthController {
  constructor(
    private readonly _authService: AuthService,
    /**
     * Jwt Configuration
     */
    @Inject(jwtConfig.KEY)
    private readonly _jwtConfiguration: ConfigType<typeof JwtConfig>,
  ) {}

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
    return this._authService.signIn(signInDto);
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
    return this._authService.refreshToken(refreshTokenDto);
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
    return this._authService.signUp(registerRequest);
  }

  @Post('forgot-password')
  @Auth(AuthType.None)
  async forgotPassword(@Body() requestDto: RequestTokenDto) {
    const resetUrl = `${this._jwtConfiguration.resetUrl}?token=`;
    return this._authService.otpRequest(requestDto, resetUrl);
  }

  @Post('reset-password')
  @Auth(AuthType.None)
  @UseInterceptors(ClassSerializerInterceptor)
  async resetPassword(
    @Body(new ValidationPipe({ transform: true }))
    { token, password }: { token: string; password: string },
  ) {
    return this._authService.resetPassword(token, password);
  }

  @Patch('update-password')
  @ApiOperation({ summary: 'Use endpoint to update password' })
  async updatePassword(
    @CurrentUser('sub') userId: number,
    @Body() dto: UpdatePasswordDto,
  ) {
    return this._authService.updatePassword(userId, dto);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user from the application' })
  async logout(@Req() req: Request) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    if (!token) {
      throw new BadRequestException('Access Invalidated! ');
    }

    return await this._authService.authLogOut(token);
  }
}
