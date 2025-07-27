import { APIGatewayProxyResult } from 'aws-lambda';
import { ErrorResponse } from './error';

export const createApiResponse = (statusCode: number, body: object | undefined): APIGatewayProxyResult => ({
    statusCode,
    body: JSON.stringify(body)
});

export const createErrorResponse = (statusCode: number, error: ErrorResponse): APIGatewayProxyResult => ({
    statusCode,
    body: JSON.stringify(error)
});
