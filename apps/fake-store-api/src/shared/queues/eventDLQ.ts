import { Queue } from 'bullmq';
import { connection } from '../redis/Redis';

export const eventDLQ = new Queue('eventDLQ', { connection });
