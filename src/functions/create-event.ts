import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { randomUUID } from 'node:crypto';
import { Event } from '../models/event';

const TABLE_NAME = process.env.EVENTS_TABLE_NAME;

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler: APIGatewayProxyHandler = async (event) => {
    const eventBody = JSON.parse(event.body) as Omit<Event, 'id'>;

    const newEvent: Event = {
        ...eventBody,
        id: randomUUID(),
        createdAt: new Date().toISOString()
    };

    const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: newEvent
    });

    const result = await docClient.send(command);
    console.log(result);

    // todo: return created object

    return {
        statusCode: 200,
        body: JSON.stringify(result)
    };
};
