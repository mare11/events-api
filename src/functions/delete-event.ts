import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyHandler } from 'aws-lambda';

const TABLE_NAME = process.env.EVENTS_TABLE_NAME;

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler: APIGatewayProxyHandler = async (event) => {
    const command = new DeleteCommand({
        TableName: TABLE_NAME,
        Key: {
            id: event.pathParameters.id
        }
    });

    const result = await docClient.send(command);
    console.log(result);

    return {
        statusCode: 204,
        body: undefined
    };
};
