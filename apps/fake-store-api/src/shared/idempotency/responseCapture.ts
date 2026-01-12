import { prisma } from '../prisma/Prisma';

export function captureIdempotentResponse(req, res, next) {
  const original = res.json;

  res.json = function (body) {
    const idempotency = res.locals.idempotency;
    if (idempotency) {
      prisma.idempotencyKey.create({
        data: {
          key: idempotency.key,
          method: req.method,
          route: req.path,
          requestHash: idempotency.hash,
          status: res.statusCode,
          response: body,
        },
      });
    }

    return original.call(this, body);
  };

  next();
}
