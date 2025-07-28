import { afterEach, describe, expect, it } from 'vitest';
import { Event } from '../../src/models/event';
import { API_BASE_URL } from './util/config';
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

        const result = await fetch(API_BASE_URL, {
            method: 'POST',
            body: JSON.stringify(newEvent)
        });

        expect(result.status).toBe(200);
        const body = await result.json();
        expect(body).toMatchObject(newEvent);
    });
});
