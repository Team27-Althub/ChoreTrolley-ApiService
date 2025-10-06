import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../../users/providers/users.service';
import { SignInProvider } from './sign-in.provider';
import { SigninDto } from '../dtos/signin.dto';
import { CreateUsersDto } from '../../users/dtos/create-users.dto';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { RefreshTokenProvider } from './refresh-token.provider';
import { RequestTokenDto } from '../../users/dtos/request-token.dto';
import { UpdatePasswordDto } from '../dtos/UpdatePasswordDto';
import { RedisService } from '../../redis/redis.service';
import { JwtService } from '@nestjs/jwt';

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
    private readonly jwtService: JwtService,
    /**
     * Inject Redis
     */
    private readonly _redisService: RedisService,
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

  async updatePassword(userId: number, dto: UpdatePasswordDto) {
    return this._signInProvider.updatePassword(userId, dto);
  }

  async authLogOut(token: string) {
    const jwtPayload = await this._signInProvider.getAccessTokenObject(token);
    const expiresIn = jwtPayload.exp - Math.floor(Date.now() / 1000);
    if (!expiresIn) {
      await this._redisService.set(`bl_${token}`, '1', expiresIn);
    } else {
      await this._redisService.set(`bl_${token}`, '1');
    }
    throw new UnauthorizedException('Unauthorized');
  }

  async isTokenNullified(token: string): Promise<boolean> {
    return (await this._redisService.get(`bl_${token}`)) === '1';
  }

  async activateAccount(token: string) {
    const payload = await this._signInProvider.getAccessTokenObject(token);
    console.log('ActiveAccountPayload::->', payload);
    return this._userService.verifyActiveTokenProvided(+payload.sub, token);
  }
}
