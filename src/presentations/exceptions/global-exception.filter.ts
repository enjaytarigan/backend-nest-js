import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DomainError } from 'src/common/error/domain.error';
import { UserError } from 'src/user/entities/user.entity';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const httpException = this.toHttpException(exception);

    response
      .status(httpException.getStatus())
      .json({ message: httpException.message });
  }

  toHttpException(exception: any): HttpException {
    if (exception instanceof HttpException) {
      return exception;
    }

    if (exception instanceof DomainError) {
      return new HttpException(exception.message, exception.code);
    } else {
      console.error(exception);
      return new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
