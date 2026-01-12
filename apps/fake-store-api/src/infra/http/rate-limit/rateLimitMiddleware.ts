import { Request, Response, NextFunction } from 'express';
import { connection } from '../../../shared/redis/Redis';

export async function rateLimitMiddleware(req: Request, res: Response, next: NextFunction) {
  const key = `rate:${req.ip}`;
  const now = Date.now();

  const count = await connection.zcount(key, now - 60000, now);

  if (count >= 100) {
    return res.status(429).json({ error: 'Too many requests' });
  }

  await connection.zadd(key, now, now);
  await connection.expire(key, 60);

  next();
}
