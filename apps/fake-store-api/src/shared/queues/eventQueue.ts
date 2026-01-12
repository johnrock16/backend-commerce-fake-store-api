import { Queue, JobsOptions } from 'bullmq';
import { connection } from '../redis/Redis';

export const eventQueue = new Queue('eventQueue', { connection: connection });

export const addEventToQueue = async (eventName: string, payload: any, opts: JobsOptions) => {
  await eventQueue.add(eventName, payload, opts);
};
