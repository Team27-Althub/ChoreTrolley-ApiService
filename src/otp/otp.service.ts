import { Injectable } from '@nestjs/common';
import { OtpProvider } from './providers/otp-provider';
import { User } from '../users/providers/user.entity';
import { OtpType } from './types/OtpType';

@Injectable()
export class OtpService {
  constructor(
    /**
     * Inject Otp provider
     */
    private readonly otpServiceProvider: OtpProvider,
  ) {}

  async generateToken(user: User, otpType: OtpType) {
    return await this.otpServiceProvider.generateToken(user, otpType);
  }

  async verifyOtp(userId: number, token: string) {
    return await this.otpServiceProvider.validateOtp(userId, token);
  }

  async validatedResetToken(token: string) {
    return await this.otpServiceProvider.validateResetPasswordToken(token);
  }
}
