import { afterEach, describe, expect, it } from 'vitest';
import { Event } from '../../src/models/event';
import { EVENTS_API_BASE_URL, EVENTS_API_KEY } from './util/config';
import { cleanUpMockData, insertItem, mockEvent } from './util/mock-data';

describe('update-event', () => {
    afterEach(async () => {
        await cleanUpMockData();
    });

    it('should return 404 if no event found', async () => {
        const result = await fetch(EVENTS_API_BASE_URL, {
            method: 'PUT',
            body: JSON.stringify(mockEvent),
            headers: {
                'x-api-key': EVENTS_API_KEY
            }
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

        const result = await fetch(EVENTS_API_BASE_URL, {
            method: 'PUT',
            body: JSON.stringify(updatedEvent),
            headers: {
                'x-api-key': EVENTS_API_KEY
            }
        });

        expect(result.status).toBe(200);
        const body = await result.json();
        expect(body).toEqual(updatedEvent);
    });
});
