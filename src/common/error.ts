import { logger } from './logger';
import { createErrorResponse } from './response-util';

abstract class HttpError extends Error {
    statusCode: number;

    constructor(message: string, statusCode: number, originalError?: Error) {
        super(message, originalError);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.cause = originalError;
    }
}

export class BadRequestError extends HttpError {
    constructor(message = 'Bad request', originalError?: Error) {
        super(message, 400, originalError);
    }
}

export class NotFoundError extends HttpError {
    constructor(message = 'Resource not found', originalError?: Error) {
        super(message, 404, originalError);
    }
}

export class InternalServerError extends HttpError {
    constructor(message = 'Internal server error', originalError?: Error) {
        super(message, 500, originalError);
    }
}

export interface ErrorResponse {
    errorCode: number;
    errorMessage: string;
}

export function catchErrors(target: unknown, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: unknown[]) {
        try {
            return await originalMethod.apply(this, args);
        } catch (error) {
            logger.error('An error occurred', error);
            if (error instanceof HttpError) {
                const errorResponse = mapError(error);
                return createErrorResponse(error.statusCode, errorResponse);
            } else {
                return createErrorResponse(500, {
                    errorCode: 500,
                    errorMessage: 'Internal server error'
                });
            }
        }
    };
    return descriptor;
}

const mapError = (error: HttpError): ErrorResponse => {
    if (error instanceof InternalServerError) {
        error.message = 'Internal server error'; // not exposing internal error details
    }
    return {
        errorCode: error.statusCode,
        errorMessage: error.message
    };
};
