import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { PostsModule } from './posts/posts.module';
import { PostsController } from './posts/posts.controller';
import { PostsService } from './posts/providers/posts.service';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/providers/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import appConfig from './config/appConfig';
import databaseConfig from './config/databaseConfig';
import environmentValidation from './config/environment.validation';
import jwtConfig from './auth/config/jwtConfig';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './auth/guards/access-token/access-token.guard';
import { AuthenticationGuard } from './auth/guards/authentication/authentication.guard';
import { MailModule } from './mail/mail.module';
import { OtpModule } from './otp/otp.module';
import { Otp } from './otp/entities/otp.entity';
import { ServicesModule } from './services/services.module';
import { CategoryModule } from './category/category.module';
import { ReviewModule } from './review/review.module';
import { Service } from './services/entities/service.entity';
import { Category } from './category/entities/category.entity';
import { Review } from './review/entities/review.entity';
import { DashboardModule } from './dashboard/dashboard.module';
import { ServiceProvider } from './services/entities/service-provider.entity';
import { PaginationModule } from './common/pagination/pagination.module';
import { CoreModule } from './core/core.module';
import { GroceriesModule } from './groceries/groceries.module';
import { Grocery } from './groceries/entities/Grocery';
import { ProfileModule } from './profile/profile.module';
import { RedisModule } from './redis/redis.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';
import { Profile } from './profile/entities/profile.entity';
import { OrderModule } from './order/order.module';
import { Order } from './order/entities/order.entity';
import { OrderSequence } from './order/entities/order-sequence.entity';
import { StorageModule } from './storage/storage.module';
import { StorageMiddleware } from './common/middleware/storage-middleware';
import { PaystackModule } from './paystack/paystack.module';
import * as process from 'node:process';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    CoreModule,
    UsersModule,
    PostsModule,
    AuthModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: !ENV ? '.env' : `.env.${ENV}`,
      load: [appConfig, databaseConfig],
      validationSchema: environmentValidation,
    }),
    StorageModule.register(process.env.STORAGE_PROVIDER as any),
    CacheModule.registerAsync({
      useFactory: async () => {
        const redisUrl = new URL(process.env.REDIS_URL!);
        return {
          store: redisStore,
          // url: process.env.REDIS_URL,
          host: redisUrl.hostname,
          port: Number(redisUrl.port),
          password: redisUrl.password,
          ttl: 60,
        };
      },
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        entities: [
          User,
          Otp,
          Service,
          Category,
          Review,
          ServiceProvider,
          Grocery,
          Profile,
          Order,
          OrderSequence,
        ],
        port: +configService.get('database.port'),
        host: configService.get<string>('database.host'),
        database: configService.get<string>('database.name'),
        username: configService.get<string>('database.user'),
        password: configService.get<string>('database.password'),
        autoLoadEntities: configService.get('database.autoloadEntities'),
        synchronize: configService.get<boolean>('database.synchronize'),
        ssl: configService.get<boolean>('database.ssl'),
        extra:
          process.env.DATABASE_SSL === 'true'
            ? {
                ssl: {
                  rejectUnauthorized: false, // for Render, Heroku, or self-signed certs
                },
              }
            : {},
      }),
    }),
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync(jwtConfig.asProvider()),
    MailModule,
    OtpModule,
    ServicesModule,
    CategoryModule,
    ReviewModule,
    DashboardModule,
    PaginationModule,
    CoreModule,
    GroceriesModule,
    ProfileModule,
    RedisModule,
    // StorageModule,
    OrderModule,
    PaystackModule,
  ],
  controllers: [
    AppController,
    UsersController,
    PostsController,
    AuthController,
  ],
  providers: [
    AppService,
    PostsService,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    AccessTokenGuard,
  ],
})
export class AppModule implements NestModule {
  constructor(private readonly configService: ConfigService) {
    console.log(
      '✅ DatabaseHost:',
      this.configService.get<string>('database.host'),
    );
    console.log(
      '✅ DatabaseName:',
      this.configService.get<string>('database.name'),
    );
    console.log('✅ EnvValue:', process.env.NODE_ENV);
    console.log(
      '✅ LoadingEnvFile:',
      !process.env.NODE_ENV ? '.env' : `.env.${process.env.NODE_ENV}`,
    );
  }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(StorageMiddleware).forRoutes('*');
  }
}
