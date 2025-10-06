import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../config/jwtConfig';
import JwtConfig from '../config/jwtConfig';
import { ConfigType } from '@nestjs/config';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import { User } from '../../users/providers/user.entity';
import { SignInResponseDto } from '../../users/dtos/response.dto';

@Injectable()
export class GenerateTokensProvider {
  constructor(
    /**
     * Jwt Service
     */
    private readonly jwtService: JwtService,
    /**
     * Jwt Configuration
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof JwtConfig>,
  ) {}

  public async signToken<T>(userId: number, expiration: number, payload?: T) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        secret: this.jwtConfiguration.secret,
        issuer: this.jwtConfiguration.issuer,
        audience: this.jwtConfiguration.audience,
        expiresIn: expiration,
      },
    );
  }

  public async generateTokens(user: User): Promise<SignInResponseDto> {
    const [accessToken, refreshToken] = await Promise.all([
      //generate access token
      this.signToken<Partial<ActiveUserData>>(
        user.id,
        this.jwtConfiguration.expiration,
        {
          email: user.email,
        },
      ),

      //generate refresh token
      this.signToken(user.id, this.jwtConfiguration.refreshTokenExpiration),
    ]);

    return { accessToken, refreshToken };
  }

  async tokenVerification(token: string) {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: this.jwtConfiguration.secret,
      audience: this.jwtConfiguration.audience,
      issuer: this.jwtConfiguration.issuer,
    });
    return payload;
  }
}
