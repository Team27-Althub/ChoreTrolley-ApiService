import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import JwtConfig from '../../config/jwtConfig';
import jwtConfig from '../../config/jwtConfig';
import { Request } from 'express';
import { AuthService } from '../../providers/auth.service';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    /**
     * JwtService
     */
    private readonly jwtService: JwtService,
    /**
     * Jwt Configuration
     */
    @Inject(jwtConfig.KEY)
    private readonly jwtConfiguration: ConfigType<typeof JwtConfig>,
    private readonly _authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    //Extract the request
    const request = context.switchToHttp().getRequest();

    //Extract the token from header
    const token = this.extractRequestFromHeader(request);

    //Validate the token
    if (!token) throw new UnauthorizedException();

    const tokenNullified = await this._authService.isTokenNullified(token);

    if (tokenNullified) {
      throw new UnauthorizedException('Token has been revoked');
    }

    try {
      request.user = await this.jwtService.verifyAsync(
        token,
        this.jwtConfiguration,
      );
    } catch (e) {
      throw new UnauthorizedException(e);
    }
    return true;
  }

  private extractRequestFromHeader(request: Request): string | undefined {
    const [, token] = request.headers.authorization?.split(' ') ?? [];
    return token;
  }
}
