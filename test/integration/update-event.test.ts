import { afterEach, describe, expect, it } from 'vitest';
import { Event } from '../../src/models/event';
import { API_BASE_URL } from './util/config';
import { cleanUpMockData, insertItem, mockEvent } from './util/mock-data';

describe('update-event', () => {
    afterEach(async () => {
        await cleanUpMockData();
    });

    it('should return 404 if no event found', async () => {
        const result = await fetch(API_BASE_URL, {
            method: 'PUT',
            body: JSON.stringify(mockEvent)
        });

        expect(result.status).toBe(404);
        const body = await result.json();
        expect(body).toEqual({
            errorCode: 404,
            errorMessage: `Event with id '${mockEvent.id}' not found!`
        });
    });

    it('should update event', async () => {
        await insertItem();
        const updatedEvent: Event = { ...mockEvent, description: 'updated description' };

        const result = await fetch(API_BASE_URL, {
            method: 'PUT',
            body: JSON.stringify(updatedEvent)
        });

        expect(result.status).toBe(200);
        const body = await result.json();
        expect(body).toEqual(updatedEvent);
    });
});
