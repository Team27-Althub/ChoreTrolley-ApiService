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
import { ActiveUserData } from '../interfaces/active-user-data.interface';

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

    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
      } as ActiveUserData,
      {
        secret: this.jwtConfiguration.secret,
        issuer: this.jwtConfiguration.issuer,
        expiresIn: this.jwtConfiguration.expiration,
        audience: this.jwtConfiguration.audience,
      },
    );
    //access token object
    return { accessToken };
  }

  public async signUp(createUserDto: CreateUsersDto) {
    return this.usersService.userRegistration(createUserDto);
  }
}
