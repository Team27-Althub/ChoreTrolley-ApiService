import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
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
import { RequestTokenDto } from '../../users/dtos/request-token.dto';
import { OtpType } from '../../otp/types/OtpType';
import { OtpService } from '../../otp/otp.service';
import { UserStatus } from '../../users/enums/user-status';
import { MailService } from '../../mail/providers/mail.service';
import { UpdatePasswordDto } from '../dtos/UpdatePasswordDto';

@Injectable()
export class SignInProvider {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly _usersService: UsersService,
    /**
     * Otp Service
     */
    private readonly _otpService: OtpService,
    /**
     * Hashing provider
     */
    private readonly _hashingProvider: HashingProvider,
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
    private readonly _generateTokensProvider: GenerateTokensProvider,
    /**
     * Mail service
     */
    private readonly _mailService: MailService,
  ) {}

  public async signIn(signInDto: SigninDto) {
    const user = await this._usersService.findUserByEmail(signInDto.email);

    let isPasswordValid: boolean = false;

    try {
      isPasswordValid = await this._hashingProvider.comparePassword(
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

    //Check if an account is UserStatus.UnVerified
    if (user.status === UserStatus.UnVerified) {
      throw new UnauthorizedException(`Account is ${user.status}`);
    }
    const tokens = await this._generateTokensProvider.generateTokens(user);
    return { ...tokens, user };
  }

  public async signUp(createUserDto: CreateUsersDto) {
    return this._usersService.userRegistration(createUserDto);
  }

  async otpRequest(requestDto: RequestTokenDto, resetUrl: string) {
    const { email } = requestDto;
    const user = await this._usersService.findUserByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }
    //Send Otp if user exists
    const otp = await this._otpService.generateToken(user, OtpType.RESET_LINK);

    try {
      const urlReset = `${resetUrl}${otp}`;
      await this._mailService.sendUserWelcome(user, otp, urlReset);
    } catch (e) {
      throw new RequestTimeoutException(e);
    }
    return otp;
  }

  async resetPassword(token: string, newPassword: string) {
    const userId = await this._otpService.validatedResetToken(token);
    const userExist = await this._usersService.findUserByUserId(userId);

    if (!userExist) {
      throw new BadRequestException('User not found');
    }
    //hash the new password
    userExist.password = await this._hashingProvider.hashPassword(newPassword);
    return await this._usersService.updateUserAccount(userExist);
  }

  async updatePassword(userId: number, dto: UpdatePasswordDto) {
    const userExist = await this._usersService.findUserByUserId(userId);
    if (!userExist) {
      throw new NotFoundException('User not found');
    }
    const foundMatchPassword = await this._hashingProvider.comparePassword(
      dto.oldPassword,
      userExist.password,
    );

    if (!foundMatchPassword) {
      throw new BadRequestException('Invalid old password');
    }
    userExist.password = await this._hashingProvider.hashPassword(
      dto.newPassword,
    );
    return await this._usersService.updateUserAccount(userExist);
  }

  async getAccessTokenObject(token: string): Promise<JwtPayload> {
    try {
      return await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.jwtConfiguration.secret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });
    } catch (e) {
      throw new UnauthorizedException(e.message || 'Invalid token');
    }
  }
}

export interface JwtPayload {
  sub: string;
  email: string;
  iat?: number;
  exp?: number;
}
