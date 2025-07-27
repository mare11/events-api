import { ConditionalCheckFailedException, DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    ScanCommand,
    UpdateCommand
} from '@aws-sdk/lib-dynamodb';
import { randomUUID } from 'node:crypto';
import { Event } from '../models/event';
import { NotFoundError } from './error';
import { logger } from './logger';

const TABLE_NAME = process.env.EVENTS_TABLE_NAME;

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const getEvent = async (eventId: string): Promise<Event> => {
    const command = new GetCommand({
        TableName: TABLE_NAME,
        Key: {
            id: eventId
        }
    });

    const result = await docClient.send(command);

    if (!result.Item) {
        throw new NotFoundError(`Event with id '${eventId}' not found!`);
    }

    logger.info(`Found event with id '${eventId}'`);
    return result.Item as Event;
};

export const getAllEvents = async (): Promise<Event[]> => {
    const command = new ScanCommand({
        TableName: TABLE_NAME
    });

    // todo: we could add pagination support here

    const result = await docClient.send(command);
    logger.info(`'Found ${result.Items?.length ?? 0} events'`);

    return (result.Items as Event[]) ?? [];
};

export const createEvent = async (event: Omit<Event, 'id' | 'createdAt'>): Promise<Event> => {
    const newEvent: Event = {
        id: randomUUID(),
        name: event.name,
        description: event.description,
        date: event.date,
        createdAt: new Date().toISOString()
    };

    const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: newEvent
    });

    await docClient.send(command);
    logger.info(`Successfully created event with id '${newEvent.id}'`);

    return newEvent;
};

export const updateEvent = async (event: Event): Promise<Event> => {
    const command = new UpdateCommand({
        TableName: TABLE_NAME,
        Key: {
            id: event.id
        },
        UpdateExpression: 'set #name = :name, #description = :description, #date = :date',
        ExpressionAttributeNames: {
            '#name': 'name',
            '#description': 'description',
            '#date': 'date'
        },
        ExpressionAttributeValues: {
            ':name': event.name,
            ':description': event.description,
            ':date': event.date
        },
        ConditionExpression: 'attribute_exists(id)',
        ReturnValues: 'ALL_NEW'
    });

    try {
        const result = await docClient.send(command);
        logger.info(`Successfully updated event with id '${event.id}'`);

        return result.Attributes as Event;
    } catch (error) {
        if (error instanceof ConditionalCheckFailedException) {
            throw new NotFoundError(`Event with id '${event.id}' not found!`);
        }
        throw error;
    }
};

export const deleteEvent = async (eventId: string): Promise<void> => {
    const command = new DeleteCommand({
        TableName: TABLE_NAME,
        Key: {
            id: eventId
        },
        ConditionExpression: 'attribute_exists(id)'
    });

    try {
        await docClient.send(command);
        logger.info(`Successfully deleted event with id '${eventId}'`);
    } catch (error) {
        if (error instanceof ConditionalCheckFailedException) {
            throw new NotFoundError(`Event with id '${eventId}' not found!`);
        }
        throw error;
    }
};
