import {
  CallHandler,
  ExecutionContext,
  Logger,
  NestInterceptor,
  Injectable
} from '@nestjs/common';
import { Request } from 'express';
import { catchError, Observable, tap } from 'rxjs';

@Injectable()
export class ResponseTimeInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    const logger = new Logger('ResponseTimeInterceptor', { timestamp: true });
    const request: Request = context.switchToHttp().getRequest();

    const { path } = request;
    const startedAt = Date.now();

    return next.handle().pipe(
      tap(() =>
        logger.log(
          `Request to ${path} took ${Date.now() - startedAt}ms to respond`
        )
      ),
      catchError(err => {
        logger.log(
          `Request to ${path} failed & took ${
            Date.now() - startedAt
          }ms to respond`
        );
        throw err;
      })
    );
  }
}
