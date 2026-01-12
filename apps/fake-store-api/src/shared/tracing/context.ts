import { AsyncLocalStorage } from 'node:async_hooks';

export interface TraceContext {
  correlationId: string;
}

export const traceContext = new AsyncLocalStorage<TraceContext>();

export function getTrace() {
  return traceContext.getStore();
}
