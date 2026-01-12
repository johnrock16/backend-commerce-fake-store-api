import pino from 'pino';
import pretty from 'pino-pretty';
import { getTrace } from '../../shared/tracing/context';
import { fileStream } from '../../infra/logger/fileStream';

const streams = [
  {
    level: 'info',
    stream: pretty({ colorize: true }),
  },
  {
    level: 'info',
    stream: fileStream,
  },
];

export const logger = pino(
  {
    base: { app: 'fake-store-api' },
    timestamp: pino.stdTimeFunctions.isoTime,
    mixin() {
      const trace = getTrace();
      return trace ? { correlationId: trace.correlationId } : {};
    },
  },
  pino.multistream(streams),
);
