import { afterEach, describe, expect, it } from 'vitest';
import { Event } from '../../src/models/event';
import { EVENTS_API_BASE_URL, EVENTS_API_KEY } from './util/config';
import { cleanUpMockData, mockEvent } from './util/mock-data';

describe('create-event', () => {
    afterEach(async () => {
        await cleanUpMockData();
    });

    it('should create event', async () => {
        const newEvent: Omit<Event, 'id' | 'createdAt'> = {
            name: mockEvent.name,
            description: mockEvent.description,
            date: mockEvent.date
        };

        const result = await fetch(EVENTS_API_BASE_URL, {
            method: 'POST',
            body: JSON.stringify(newEvent),
            headers: {
                'x-api-key': EVENTS_API_KEY
            }
        });

        expect(result.status).toBe(200);
        const body = await result.json();
        expect(body).toMatchObject(newEvent);
    });
});
