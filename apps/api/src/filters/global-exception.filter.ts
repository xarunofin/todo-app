import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

import { StandardResponse } from '@todo-app/shared';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        message = (exceptionResponse as any).message || exception.cause;

        // Handle class-validator errors
        if (Array.isArray((exceptionResponse as any).message)) {
          message = (exceptionResponse as any).message;
        }
      } else {
        message = exception.message;
      }
    }

    const responseDto: StandardResponse<null> = {
      statusCode: status,
      message: message,
      data: null,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json(responseDto);
  }
}
