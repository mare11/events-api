import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb';
import {
    DeleteCommand,
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    ScanCommand,
    UpdateCommand
} from '@aws-sdk/lib-dynamodb';
import { mockClient } from 'aws-sdk-client-mock';
import 'aws-sdk-client-mock-jest';
import 'aws-sdk-client-mock-jest/vitest';
import { randomUUID } from 'node:crypto';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { Event } from '../models/event';
import { NotFoundError } from './error';
import { createEvent, deleteEvent, getAllEvents, getEvent, updateEvent } from './event-repository';

vi.mock('node:crypto');

describe('event-repository', () => {
    const mockEvent: Event = {
        id: 'c15e233f-05f6-450c-a1dd-f2cb0e7d17ea',
        name: 'test-event',
        description: 'this is test event',
        date: '2025-08-01',
        createdAt: '2025-07-25T16:42:29.438Z'
    };

    const ddbMock = mockClient(DynamoDBDocumentClient);

    beforeEach(() => {
        ddbMock.reset();
        vi.useRealTimers();
    });

    describe('getEvent', () => {
        it('should throw an error if DDB command fails', async () => {
            const error = new Error('DDB error');
            ddbMock.on(GetCommand).rejects(error);

            await expect(getEvent(mockEvent.id)).rejects.toBe(error);

            expect(ddbMock).toHaveReceivedCommand(GetCommand);
        });

        it('should throw an error if result is empty', async () => {
            ddbMock.on(GetCommand).resolves({});

            await expect(getEvent(mockEvent.id)).rejects.toEqual(
                new NotFoundError(`Event with id '${mockEvent.id}' not found!`)
            );

            expect(ddbMock).toHaveReceivedCommandWith(GetCommand, { Key: { id: mockEvent.id } });
        });

        it('should return result', async () => {
            ddbMock.on(GetCommand).resolves({ Item: mockEvent });

            const result = await getEvent(mockEvent.id);

            expect(result).toEqual(mockEvent);
            expect(ddbMock).toHaveReceivedCommandWith(GetCommand, { Key: { id: mockEvent.id } });
        });
    });

    describe('getAllEvents', () => {
        it('should throw an error if DDB command fails', async () => {
            const error = new Error('DDB error');
            ddbMock.on(ScanCommand).rejects(error);

            await expect(getAllEvents).rejects.toBe(error);

            expect(ddbMock).toHaveReceivedCommand(ScanCommand);
        });

        it('should return empty array if there are no items', async () => {
            ddbMock.on(ScanCommand).resolves({});

            const result = await getAllEvents();

            expect(result).toEqual([]);
            expect(ddbMock).toHaveReceivedCommand(ScanCommand);
        });

        it('should return result', async () => {
            ddbMock.on(ScanCommand).resolves({ Items: [mockEvent, mockEvent, mockEvent] });

            const result = await getAllEvents();

            expect(result.length).toEqual(3);
            expect(ddbMock).toHaveReceivedCommand(ScanCommand);
        });
    });

    describe('createEvent', () => {
        const mockDate = new Date('2025-07-25T16:42:29.438Z');
        const randomUUIDMock = randomUUID as Mock;

        it('should throw an error if DDB command fails', async () => {
            const error = new Error('DDB error');
            ddbMock.on(PutCommand).rejects(error);
            vi.setSystemTime(mockDate);
            randomUUIDMock.mockReturnValue(mockEvent.id);

            await expect(createEvent(mockEvent)).rejects.toBe(error);

            expect(ddbMock).toHaveReceivedCommand(PutCommand);
        });

        it('should return result', async () => {
            ddbMock.on(PutCommand).resolves({});
            vi.setSystemTime(mockDate);
            randomUUIDMock.mockReturnValue(mockEvent.id);

            const result = await createEvent(mockEvent);

            expect(result).toEqual(mockEvent);
            expect(ddbMock).toHaveReceivedCommandWith(PutCommand, {
                Item: { ...mockEvent, createdAt: mockDate.toISOString() }
            });
        });
    });

    describe('updateEvent', () => {
        it('should throw an error if DDB command fails', async () => {
            const error = new Error('DDB error');
            ddbMock.on(UpdateCommand).rejects(error);

            await expect(updateEvent(mockEvent)).rejects.toBe(error);

            expect(ddbMock).toHaveReceivedCommand(UpdateCommand);
        });

        it('should throw a not found error if event does not exist', async () => {
            const error = new ConditionalCheckFailedException({ $metadata: {}, message: 'Event not found' });
            ddbMock.on(UpdateCommand).rejects(error);

            await expect(updateEvent(mockEvent)).rejects.toEqual(
                new NotFoundError(`Event with id '${mockEvent.id}' not found!`)
            );

            expect(ddbMock).toHaveReceivedCommandWith(UpdateCommand, {
                Key: { id: mockEvent.id },
                ConditionExpression: 'attribute_exists(id)'
            });
        });

        it('should return result', async () => {
            ddbMock.on(UpdateCommand).resolves({ Attributes: mockEvent });

            const result = await updateEvent(mockEvent);

            expect(result).toEqual(mockEvent);
            expect(ddbMock).toHaveReceivedCommandWith(UpdateCommand, {
                Key: { id: mockEvent.id },
                ReturnValues: 'ALL_NEW'
            });
        });
    });

    describe('deleteEvent', () => {
        it('should throw an error if DDB command fails', async () => {
            const error = new Error('DDB error');
            ddbMock.on(DeleteCommand).rejects(error);

            await expect(deleteEvent(mockEvent.id)).rejects.toBe(error);

            expect(ddbMock).toHaveReceivedCommand(DeleteCommand);
        });

        it('should throw a not found error if event does not exist', async () => {
            const error = new ConditionalCheckFailedException({ $metadata: {}, message: 'Event not found' });
            ddbMock.on(DeleteCommand).rejects(error);

            await expect(deleteEvent(mockEvent.id)).rejects.toEqual(
                new NotFoundError(`Event with id '${mockEvent.id}' not found!`)
            );

            expect(ddbMock).toHaveReceivedCommandWith(DeleteCommand, {
                Key: { id: mockEvent.id },
                ConditionExpression: 'attribute_exists(id)'
            });
        });

        it('should delete event', async () => {
            ddbMock.on(DeleteCommand).resolves({ Attributes: mockEvent });

            await deleteEvent(mockEvent.id);

            expect(ddbMock).toHaveReceivedCommandWith(DeleteCommand, { Key: { id: mockEvent.id } });
        });
    });
});
