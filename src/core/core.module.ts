import {
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE, Reflector } from '@nestjs/core';
import { LoggingInterceptor } from '../common/interceptors/log/LogginInterceptor';
import { DatabaseInterceptor } from '../common/interceptors/database/DatabaseInterceptor';
import { AllExceptionsFilter } from '../common/filters/exceptions/AllExceptionsFilter';
import { DataResponseInterceptor } from '../common/interceptors/data-reponse/data-response.interceptor';
import { ConfigService } from '@nestjs/config';
import { StorageModule } from '../storage/storage.module';

@Module({
  // imports: [
  //   StorageModule.register(process.env.STORAGE_PROVIDER as any), // e.g. "gcs"
  // ],
  providers: [
    // ✅ Global Validation Pipe
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          transform: true,
          transformOptions: {
            enableImplicitConversion: true,
          },
        }),
    },

    // ✅ Global Logging Interceptor
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },

    // ✅ Global Database Interceptor
    {
      provide: APP_INTERCEPTOR,
      useClass: DatabaseInterceptor,
    },

    // ✅ Global ClassSerializer Interceptor
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },

    // ✅ Global Skip Wrapper Interceptor
    {
      provide: APP_INTERCEPTOR,
      useFactory: (configService: ConfigService, reflector: Reflector) =>
        new DataResponseInterceptor(configService, reflector),
      inject: [ConfigService, Reflector],
    },

    // ✅ Global Exception Filter
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class CoreModule {}
