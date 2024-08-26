import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { StandardResponse } from '@todo-app/shared';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, StandardResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<StandardResponse<T>> {
    return next.handle().pipe(
      map((data) => ({
        statusCode: context.switchToHttp().getResponse().statusCode,
        message: `Successfully ${context.switchToHttp().getRequest().method.toString().toLowerCase()} ${context.switchToHttp().getRequest().url === '/' ? 'root' : context.switchToHttp().getRequest().url.split('/').pop()}!`,
        data,
        timestamp: new Date().toISOString(),
      })),
    );
  }
}
