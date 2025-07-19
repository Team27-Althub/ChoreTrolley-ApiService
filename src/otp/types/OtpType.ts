import { Otp } from '../entities/otp.entity';

export enum OtpType {
  OTP = 'otp',
  RESET_LINK = 'reset_password',
}

export interface OtpResponse {
  token: string;
  otp: Otp;
}
