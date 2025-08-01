import { afterEach, describe, expect, it } from 'vitest';
import { EVENTS_API_BASE_URL, EVENTS_API_KEY } from './util/config';
import { cleanUpMockData, insertItem, mockEvent } from './util/mock-data';

describe('get-event', () => {
    afterEach(async () => {
        await cleanUpMockData();
    });

    it('should return 404 if no event found', async () => {
        const result = await fetch(`${EVENTS_API_BASE_URL}/123`, {
            headers: {
                'x-api-key': EVENTS_API_KEY
            }
        });

        expect(result.status).toBe(404);
        const body = await result.json();
        expect(body).toEqual({
            errorCode: 404,
            errorMessage: `Event with id '123' not found!`
        });
    });

    it('should get event', async () => {
        await insertItem();

        const result = await fetch(`${EVENTS_API_BASE_URL}/${mockEvent.id}`, {
            headers: {
                'x-api-key': EVENTS_API_KEY
            }
        });

        expect(result.status).toBe(200);
        const body = await result.json();
        expect(body).toEqual(mockEvent);
    });
});
