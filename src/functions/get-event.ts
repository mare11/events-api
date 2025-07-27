import { LambdaInterface } from '@aws-lambda-powertools/commons/types';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { logger } from 'src/common/logger';
import { createApiResponse } from 'src/common/response-util';

// todo: move code for dynamodb to another file? (service/repository)

const TABLE_NAME = process.env.EVENTS_TABLE_NAME;

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

class Lambda implements LambdaInterface {
    public handler: APIGatewayProxyHandler = async (event) => {
        const command = new GetCommand({
            TableName: TABLE_NAME,
            Key: {
                id: event.pathParameters.id
            }
        });

        try {
            const result = await docClient.send(command);
            logger.info('GetCommand result', result);

            if (!result.Item) {
                return createApiResponse(
                    404,
                    `Item with id '${event.pathParameters.id}' not found!`
                );
            }

            return createApiResponse(200, JSON.stringify(result.Item));
        } catch {
            return createApiResponse(500, 'Internal server error'); // todo: create a proper json error response
        }
    };
}

const lambda = new Lambda();
export const handler = lambda.handler.bind(lambda);
