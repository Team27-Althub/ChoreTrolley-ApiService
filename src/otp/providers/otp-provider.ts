import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { MoreThan, Repository } from 'typeorm';
import { Otp } from '../entities/otp.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { User } from '../../users/providers/user.entity';
import { OtpType } from '../types/OtpType';
import { JwtService } from '@nestjs/jwt';
import jwtConfig from '../../auth/config/jwtConfig';
import JwtConfig from '../../auth/config/jwtConfig';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class OtpProvider {
  constructor(
    /**
     * Otp Repository
     */
    @InjectRepository(Otp)
    private readonly _otpRepository: Repository<Otp>,
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

  private readonly otpTypeHandlers: Record<
    OtpType,
    (payload?: any) => Promise<any>
  > = {
    [OtpType.OTP]: (payload) => this.useResetOtp(payload),
    [OtpType.RESET_LINK]: (payload) => this.useResetLink(payload),
  };

  /**
   * generate token
   * @param user
   * @param otpType
   */
  async generateToken(user: User, otpType: OtpType): Promise<string> {
    return await this.getTokenRequestByOtpType(user, otpType);
  }

  async validateOtp(userId: number, token: string): Promise<boolean> {
    const validateToken = await this._otpRepository.findOne({
      where: {
        user: { id: userId },
        expiresAt: MoreThan(new Date()),
      },
    });

    if (!validateToken) {
      throw new BadRequestException('OTP has expired, request a new one');
    }
    const isValidToken = await bcrypt.compare(token, validateToken.token);

    if (!isValidToken) {
      throw new BadRequestException('Invalid Otp. Please try again');
    }

    return true;
  }

  async validateResetPasswordToken(token: string) {
    try {
      const jwtDecode = await this.jwtService.verifyAsync(token, {
        secret: this.jwtConfiguration.resetSecret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
      });

      return jwtDecode.id;
    } catch (e) {
      //Token already expired
      if (e.name === 'TokenExpiredError') {
        throw new BadRequestException(
          'Reset token expired. Please request a new one',
        );
      }

      throw new BadRequestException(
        'Invalid reset token. Please request a new one',
      );
    }
  }

  private async getTokenRequestByOtpType(payload: User, type: OtpType) {
    const handlers = this.otpTypeHandlers[type];
    if (!handlers) throw new Error(`Unsupported OtpType: ${type}`);
    return handlers(payload);
  }

  private async useResetLink(user: User) {
    return this.jwtService.signAsync(
      { id: user.id, email: user.email },
      {
        secret: this.jwtConfiguration.resetSecret,
        audience: this.jwtConfiguration.audience,
        issuer: this.jwtConfiguration.issuer,
        expiresIn: '30m',
      },
    );
  }

  private async useResetOtp(user: User): Promise<string> {
    const now = new Date();
    const token = crypto.randomInt(100000, 999999).toString();
    const hashOtp = await bcrypt.hash(token, 10);
    const expiresAt = new Date(now.getTime() + 5 * 60 * 1000);

    //check if otp already exists for that user
    const existingOtp = await this._otpRepository.findOne({
      where: {
        user: { id: user.id },
        type: OtpType.OTP,
      },
    });

    if (existingOtp) {
      try {
        existingOtp.token = hashOtp;
        existingOtp.expiresAt = expiresAt;
        await this._otpRepository.save(existingOtp);
      } catch (error) {
        throw new BadRequestException(error);
      }
      return token;
    }

    //create otp entity
    const otp = this._otpRepository.create({
      user,
      token: hashOtp,
      type: OtpType.OTP,
      expiresAt,
    });

    try {
      await this._otpRepository.save(otp);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
    return token;
  }
}
