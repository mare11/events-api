import { LambdaInterface } from '@aws-lambda-powertools/commons/types';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { logger } from 'src/common/logger';
import { createApiResponse } from 'src/common/response-util';

// todo: move code for dynamodb to another file? (service/repository)

const TABLE_NAME = process.env.EVENTS_TABLE_NAME;

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

class Lambda implements LambdaInterface {
    public handler: APIGatewayProxyHandler = async () => {
        const command = new ScanCommand({
            TableName: TABLE_NAME
        });

        const result = await docClient.send(command);
        logger.info(`'Found ${result.Items?.length ?? 0} events'`);

        // todo: error handling

        // todo: pagination

        return createApiResponse(200, JSON.stringify(result.Items ?? []));
    };
}

const lambda = new Lambda();
export const handler = lambda.handler.bind(lambda);
