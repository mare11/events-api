import { BatchWriteItemCommand, DynamoDBClient, ScanCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { Event } from '../../../src/models/event';
import { EVENTS_TABLE_NAME } from './config';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const mockEvent: Event = {
    id: 'c15e233f-05f6-450c-a1dd-f2cb0e7d17ea',
    name: 'test-event',
    description: 'this is a test event',
    date: '2025-08-01',
    createdAt: '2025-07-25T16:42:29.438Z'
};

export const insertItem = async () => {
    const command = new PutCommand({
        TableName: EVENTS_TABLE_NAME,
        Item: mockEvent
    });

    await docClient.send(command);
};

export const cleanUpMockData = async () => {
    const result = await docClient.send(new ScanCommand({ TableName: EVENTS_TABLE_NAME }));

    if (!result.Items || result.Items.length === 0) {
        return;
    }

    await client.send(
        new BatchWriteItemCommand({
            RequestItems: {
                [EVENTS_TABLE_NAME]: result.Items.map((item) => ({
                    DeleteRequest: {
                        Key: {
                            id: item.id
                        }
                    }
                }))
            }
        })
    );
};
