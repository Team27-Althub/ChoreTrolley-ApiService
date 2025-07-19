import { Global, Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpProvider } from './providers/otp-provider';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from './entities/otp.entity';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from '../auth/config/jwtConfig';
import { JwtModule } from '@nestjs/jwt';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Otp]),
    UsersModule,
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  providers: [OtpService, OtpProvider],
  exports: [OtpService, JwtModule, ConfigModule],
})
export class OtpModule {}
