import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/providers/users.service';
import { SignInProvider } from './sign-in.provider';
import { SigninDto } from '../dtos/signin.dto';
import { CreateUsersDto } from '../../users/dtos/create-users.dto';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { RefreshTokenProvider } from './refresh-token.provider';
import { RequestTokenDto } from '../../users/dtos/request-token.dto';

@Injectable()
export class AuthService {
  constructor(
    /**
     * Inject UserService
     */
    @Inject(forwardRef(() => UsersService))
    private readonly _userService: UsersService,
    /**
     * Inject SignInProvider
     */
    private readonly _signInProvider: SignInProvider,
    /**
     * Refresh token provider
     */
    private readonly _refreshTokenProvider: RefreshTokenProvider,
  ) {}

  public async signIn(signInDto: SigninDto) {
    return await this._signInProvider.signIn(signInDto);
  }

  public async signUp(createUserDto: CreateUsersDto) {
    return await this._signInProvider.signUp(createUserDto);
  }

  public async refreshToken(refreshTokenDto: RefreshTokenDto) {
    return await this._refreshTokenProvider.refreshToken(refreshTokenDto);
  }

  async otpRequest(requestDto: RequestTokenDto, resetUrl: string) {
    return this._signInProvider.otpRequest(requestDto, resetUrl);
  }

  async resetPassword(token: string, password: string) {
    return this._signInProvider.resetPassword(token, password);
  }
}
