import crypto from 'crypto';
import { prisma } from '../../shared/prisma/Prisma';

export async function idempotencyMiddleware(req, res, next) {
  const key = req.headers['idempotency-key'];
  if (!key) return next();

  const hash = crypto.createHash('sha256').update(JSON.stringify(req.body)).digest('hex');

  const existing = await prisma.idempotencyKey.findUnique({
    where: {
      key_method_route: {
        key,
        method: req.method,
        route: req.path,
      },
    },
  });

  if (existing) {
    if (existing.requestHash !== hash) {
      return res.status(409).json({
        error: 'Idempotency key reused with different payload',
      });
    }

    return res.status(existing.status).json(existing.response);
  }

  res.locals.idempotency = { key, hash };
  next();
}
