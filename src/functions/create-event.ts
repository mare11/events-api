import { LambdaInterface } from '@aws-lambda-powertools/commons/types';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { randomUUID } from 'node:crypto';
import { logger } from 'src/common/logger';
import { createApiResponse } from 'src/common/response-util';
import { Event } from '../models/event';

const TABLE_NAME = process.env.EVENTS_TABLE_NAME;

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

class Lambda implements LambdaInterface {
    public handler: APIGatewayProxyHandler = async (event) => {
        const eventBody = JSON.parse(event.body) as Omit<Event, 'id'>;

        const newEvent: Event = {
            id: randomUUID(),
            name: eventBody.name,
            description: eventBody.description,
            date: eventBody.date,
            createdAt: new Date().toISOString()
        };

        const command = new PutCommand({
            TableName: TABLE_NAME,
            Item: newEvent
        });

        const result = await docClient.send(command);
        logger.info('PutCommand result', result);

        // todo: error handling

        return createApiResponse(200, JSON.stringify(newEvent));
    };
}

const lambda = new Lambda();
export const handler = lambda.handler.bind(lambda);
