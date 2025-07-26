import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyHandler } from 'aws-lambda';

// todo: move code for dynamodb to another file? (service/repository)

const TABLE_NAME = process.env.EVENTS_TABLE_NAME;

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler: APIGatewayProxyHandler = async (event) => {
    const command = new GetCommand({
        TableName: TABLE_NAME,
        Key: {
            id: event.pathParameters.id
        }
    });

    const result = await docClient.send(command);
    console.log(result);

    // todo: error handling

    return {
        statusCode: 200,
        body: JSON.stringify(result.Item)
    };
};
