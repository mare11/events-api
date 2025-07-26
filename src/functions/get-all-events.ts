import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyHandler } from 'aws-lambda';

// todo: move code for dynamodb to another file? (service/repository)

const TABLE_NAME = process.env.EVENTS_TABLE_NAME;

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler: APIGatewayProxyHandler = async () => {
    const command = new ScanCommand({
        TableName: TABLE_NAME
    });

    const result = await docClient.send(command);
    console.log(result);

    // todo: error handling

    // todo: pagination

    return {
        statusCode: 200,
        body: JSON.stringify(result.Items)
    };
};
