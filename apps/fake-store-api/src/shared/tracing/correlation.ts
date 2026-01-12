import { randomUUID } from 'crypto';
import { traceContext } from './context';

export function correlationMiddleware(req, res, next) {
  const incoming = req.headers['x-correlation-id'];
  const correlationId = incoming || randomUUID();

  traceContext.run({ correlationId }, () => {
    res.setHeader('x-correlation-id', correlationId);
    next();
  });
}
