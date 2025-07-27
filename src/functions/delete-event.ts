import { LambdaInterface } from '@aws-lambda-powertools/commons/types';
import {
    ConditionalCheckFailedException,
    DynamoDBClient
} from '@aws-sdk/client-dynamodb';
import { DeleteCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { logger } from 'src/common/logger';
import { createApiResponse } from 'src/common/response-util';

const TABLE_NAME = process.env.EVENTS_TABLE_NAME;

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

class Lambda implements LambdaInterface {
    public handler: APIGatewayProxyHandler = async (event) => {
        const command = new DeleteCommand({
            TableName: TABLE_NAME,
            Key: {
                id: event.pathParameters.id
            },
            ConditionExpression: 'attribute_exists(id)'
        });

        try {
            const result = await docClient.send(command);
            logger.info('DeleteCommand result', result);

            return createApiResponse(204, undefined);
        } catch (error) {
            if (error instanceof ConditionalCheckFailedException) {
                return createApiResponse(
                    400,
                    `Item with id '${event.pathParameters.id}' does not exist!`
                );
            } else {
                return createApiResponse(500, 'Internal server error');
            }
        }
    };
}

const lambda = new Lambda();
export const handler = lambda.handler.bind(lambda);
