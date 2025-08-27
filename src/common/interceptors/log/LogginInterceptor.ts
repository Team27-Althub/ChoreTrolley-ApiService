import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const { method, url } = req;
    const now = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const delay = Date.now() - now;
          console.log(`✅ ${method} ${url} -- Completed in ${delay}ms`);
          this.logger.log(`✅ ${method} ${url} -- Completed in ${delay}ms`);
        },
        error: (err) => {
          const delay = Date.now() - now;
          console.error(
            `❌ ${method} ${url} -- Failed in ${delay}ms:`,
            err.message,
          );
          this.logger.error(`❌ ${method} ${url} -- Failed in ${delay}ms:`);
        },
      }),
    );

    /*return next.handle().pipe(
      tap(() => {
        const ms = Date.now() - now;
        this.logger.log(`${method} ${url} - ${ms}ms`);
      }),
    );*/
  }
}
