import { UUID } from 'node:crypto';

export interface Event {
    id: UUID;
    name: string;
    description: string;
    date: string;
    createdAt: string;
}
