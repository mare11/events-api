import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { Event } from '../models/event';

const TABLE_NAME = process.env.EVENTS_TABLE_NAME;

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler: APIGatewayProxyHandler = async (event) => {
    const eventBody = JSON.parse(event.body) as Event;

    // todo: do some kind of validation here that the item exists?

    const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: eventBody
    });

    const result = await docClient.send(command);
    console.log(result);

    // todo: return updated object?

    return {
        statusCode: 200,
        body: JSON.stringify(result)
    };
};
