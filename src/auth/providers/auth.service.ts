import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/providers/users.service';
import { SignInProvider } from './sign-in.provider';
import { SigninDto } from '../dtos/signin.dto';
import { CreateUsersDto } from '../../users/dtos/create-users.dto';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { RefreshTokenProvider } from './refresh-token.provider';

@Injectable()
export class AuthService {
  constructor(
    /**
     * Inject UserService
     */
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    /**
     * Inject SignInProvider
     */
    private readonly signInProvider: SignInProvider,
    /**
     * Refresh token provider
     */
    private readonly refreshTokenProvider: RefreshTokenProvider,
  ) {}

  public async signIn(signInDto: SigninDto) {
    return await this.signInProvider.signIn(signInDto);
  }

  public async signUp(createUserDto: CreateUsersDto) {
    return await this.signInProvider.signUp(createUserDto);
  }

  public async refreshToken(refreshTokenDto: RefreshTokenDto) {
    return await this.refreshTokenProvider.refreshToken(refreshTokenDto);
  }
}
