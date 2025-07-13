import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwtConfig';
import JwtConfig from '../config/jwtConfig';
import { ConfigType } from '@nestjs/config';
import { GenerateTokensProvider } from './generate-tokens.provider';
import { UsersService } from '../../users/providers/users.service';

@Injectable()
export class RefreshTokenProvider {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    /**
     * Jwt Service
     */
    private readonly jwtService: JwtService,
    /**
     * Jwt Configuration
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof JwtConfig>,
    /**
     * Generate Tokens Provider
     */
    private readonly generateTokensProvider: GenerateTokensProvider,
  ) {}

  public async refreshToken(refreshTokenDto: RefreshTokenDto) {
    try {
      //verify refresh token using jwtService
      //for typeSafety: this.jwtService.verifyAsync<Pick<ActiveUserData, 'sub'>>()
      const { sub } = await this.jwtService.verifyAsync(
        refreshTokenDto.refreshToken,
        {
          secret: this.jwtConfiguration.secret,
          audience: this.jwtConfiguration.audience,
          issuer: this.jwtConfiguration.issuer,
        },
      );

      const user = await this.usersService.findUserByUserId(sub);

      return await this.generateTokensProvider.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException(
        error,
        'Unable to generate refresh token',
      );
    }
  }
}
