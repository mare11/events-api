import { afterEach, describe, expect, it } from 'vitest';
import { API_BASE_URL } from './util/config';
import { cleanUpMockData, insertItem, mockEvent } from './util/mock-data';

describe('get-all-events', () => {
    afterEach(async () => {
        await cleanUpMockData();
    });

    it('should get all events', async () => {
        await insertItem();
        await insertItem();

        const result = await fetch(API_BASE_URL);

        expect(result.status).toBe(200);
        const body = await result.json();
        expect(body).toEqual(expect.arrayContaining([mockEvent]));
    });
});
