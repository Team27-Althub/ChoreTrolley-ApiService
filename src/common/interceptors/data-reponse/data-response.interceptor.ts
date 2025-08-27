import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { SKIP_RESPONSE_WRAPPER } from '../../decorators/skip-response.decorator';

@Injectable()
export class DataResponseInterceptor<T> implements NestInterceptor<T, any> {
  constructor(
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const skip = this.reflector.getAllAndOverride<boolean>(
      SKIP_RESPONSE_WRAPPER,
      [context.getHandler(), context.getClass()],
    );

    if (skip) return next.handle();

    return next.handle().pipe(
      map((data: any) => ({
        apiVersion: this.configService.get<string>('appConfig.apiVersion'),
        data: data,
      })),
    );
  }
}
