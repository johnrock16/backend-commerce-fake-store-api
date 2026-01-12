import { addEventToQueue } from '../../shared/queues/eventQueue';
import { getTrace } from '../tracing/context';

type EventHandler<T> = (event: T) => Promise<void> | void;

export class EventBus {
  private handlers: Map<string, EventHandler<any>[]> = new Map();

  subscribe<T>(eventName: string, handler: EventHandler<T>) {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, []);
    }
    this.handlers.get(eventName)!.push(handler);
  }

  async publish<T>(eventName: string, event: T) {
    const trace = getTrace();
    const handlers = this.handlers.get(eventName) || [];

    await Promise.all(handlers.map((h) => h({ ...event, correlationId: trace?.correlationId })));

    await addEventToQueue(
      eventName,
      { ...event, correlationId: trace?.correlationId },
      {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 1000,
        },
      },
    );
  }
}

export const eventBus = new EventBus();
