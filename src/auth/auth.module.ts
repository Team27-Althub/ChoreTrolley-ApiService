import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './providers/auth.service';
import { HashingProvider } from './providers/hashing.provider';
import { BcryptProvider } from './providers/bcrypt-provider.service';
import { SignInProvider } from './providers/sign-in.provider';
import { UsersModule } from '../users/users.module';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './config/jwtConfig';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: HashingProvider,
      useClass: BcryptProvider,
    },
    SignInProvider,
  ],
  imports: [
    forwardRef(() => UsersModule),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
  ],
  exports: [AuthService, HashingProvider, JwtModule, ConfigModule], //revisit this part of the code by excluding[JwtModule, ConfigModule]
})
export class AuthModule {}
