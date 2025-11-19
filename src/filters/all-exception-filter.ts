import { Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import CustomError from './custom-error-filter';
import { Prisma } from '@prisma/client';
import { PrismaErrors } from './prisma-error-filter';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);

  constructor(private readonly configService: ConfigService) {}

  catch(exception: any) {
    try {
      let errorMessage = exception?.message;
      if (exception instanceof Prisma.PrismaClientKnownRequestError) {
        errorMessage =
          PrismaErrors[exception.code as keyof typeof PrismaErrors] ||
          'An unknown database error occurred.';
      } else if (exception instanceof Prisma.PrismaClientUnknownRequestError) {
        errorMessage = 'An unknown error occurred during the request.';
      } else if (exception instanceof Prisma.PrismaClientRustPanicError) {
        errorMessage = 'Internal server error. Please try again later.';
      } else if (exception instanceof Prisma.PrismaClientInitializationError) {
        errorMessage = 'Failed to initialize database connection.';
      } else if (exception instanceof Prisma.PrismaClientValidationError) {
        errorMessage = 'Validation error. Please check the input data.';
      } else if (exception?.response) {
        errorMessage = exception.response.message;
        if (Array.isArray(exception.response.message.length)) {
          errorMessage = exception.response.message.join(',');
        }
      }

      this.logger.error(
        `Exception: ${errorMessage}, stack: ${exception.stack} `,
      );

      throw new CustomError(
        exception.extensions?.code ?? 'INTERNAL_SERVER_ERROR',
        errorMessage ?? 'Something Went Wrong',
      );
    } catch (error) {
      console.error(error);
    }
  }
}
