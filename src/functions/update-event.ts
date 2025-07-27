import { LambdaInterface } from '@aws-lambda-powertools/commons/types';
import {
    ConditionalCheckFailedException,
    DynamoDBClient
} from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyHandler } from 'aws-lambda';
import { logger } from 'src/common/logger';
import { createApiResponse } from 'src/common/response-util';
import { Event } from '../models/event';

const TABLE_NAME = process.env.EVENTS_TABLE_NAME;

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

class Lambda implements LambdaInterface {
    public handler: APIGatewayProxyHandler = async (event) => {
        const eventBody = JSON.parse(event.body) as Event;

        const command = new UpdateCommand({
            TableName: TABLE_NAME,
            Key: {
                id: eventBody.id
            },
            UpdateExpression:
                'set #name = :name, #description = :description, #date = :date',
            ExpressionAttributeNames: {
                '#name': 'name',
                '#description': 'description',
                '#date': 'date'
            },
            ExpressionAttributeValues: {
                ':name': eventBody.name,
                ':description': eventBody.description,
                ':date': eventBody.date
            },
            ConditionExpression: 'attribute_exists(id)',
            ReturnValues: 'ALL_NEW'
        });

        try {
            const result = await docClient.send(command);
            logger.info('UpdateCommand result', result);

            return createApiResponse(200, JSON.stringify(result.Attributes));
        } catch (error) {
            if (error instanceof ConditionalCheckFailedException) {
                return createApiResponse(
                    400,
                    `Item with id '${eventBody.id}' does not exist!`
                );
            } else {
                return createApiResponse(500, 'Internal server error');
            }
        }
    };
}

const lambda = new Lambda();
export const handler = lambda.handler.bind(lambda);
