import { APIGatewayProxyResult } from 'aws-lambda';

export const createApiResponse = (
    statusCode: number,
    body: string | undefined
): APIGatewayProxyResult => ({
    statusCode,
    body
});
