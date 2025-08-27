import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ConflictException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class DatabaseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        // Postgres unique constraint violation
        if (error.code === '23505') {
          return throwError(() => new ConflictException('Duplicate entry'));
        }
        // MySQL example: ER_DUP_ENTRY
        if (error.code === 'ER_DUP_ENTRY') {
          return throwError(() => new ConflictException('Duplicate entry'));
        }
        return throwError(() => error);
      }),
    );
  }
}
