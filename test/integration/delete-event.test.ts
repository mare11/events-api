import { afterEach, describe, expect, it } from 'vitest';
import { API_BASE_URL } from './util/config';
import { cleanUpMockData, insertItem, mockEvent } from './util/mock-data';

describe('delete-event', () => {
    afterEach(async () => {
        await cleanUpMockData();
    });

    it('should return 404 if no event found', async () => {
        const result = await fetch(`${API_BASE_URL}/123`, {
            method: 'DELETE'
        });

        expect(result.status).toBe(404);
        const body = await result.json();
        expect(body).toEqual({
            errorCode: 404,
            errorMessage: `Event with id '123' not found!`
        });
    });

    it('should delete event', async () => {
        await insertItem();

        const result = await fetch(`${API_BASE_URL}/${mockEvent.id}`, {
            method: 'DELETE'
        });

        expect(result.status).toBe(204);
    });
});
