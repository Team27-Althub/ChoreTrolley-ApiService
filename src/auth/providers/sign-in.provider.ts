import {
  forwardRef,
  Inject,
  Injectable,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../../users/providers/users.service';
import { SigninDto } from '../dtos/signin.dto';
import { HashingProvider } from './hashing.provider';
import { JwtService } from '@nestjs/jwt';
import { ConfigType } from '@nestjs/config';
import JwtConfig from '../config/jwtConfig';
import jwtConfig from '../config/jwtConfig';
import { CreateUsersDto } from '../../users/dtos/create-users.dto';
import { GenerateTokensProvider } from './generate-tokens.provider';

@Injectable()
export class SignInProvider {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    /**
     * Hashing provider
     */
    private readonly hashingProvider: HashingProvider,
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

  public async signIn(signInDto: SigninDto) {
    const user = await this.usersService.findUserByEmail(signInDto.email);

    let isPasswordValid: boolean = false;

    try {
      isPasswordValid = await this.hashingProvider.comparePassword(
        signInDto.password,
        user.password,
      );
    } catch (error) {
      throw new RequestTimeoutException(error, {
        description: 'Unable to compare password',
      });
    }

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    return await this.generateTokensProvider.generateTokens(user);
  }

  public async signUp(createUserDto: CreateUsersDto) {
    return this.usersService.userRegistration(createUserDto);
  }
}
