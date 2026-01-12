import { Request, Response, NextFunction } from 'express';
import { connection } from '../../../shared/redis/Redis';

const SOFT_BAN = 50;
const HARD_BAN = 100;
const DECAY_SECONDS = 60 * 15;

export async function abuseDetectionMiddleware(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip;
  const key = `abuse:${ip}`;

  const score = Number((await connection.get(key)) || 0);

  if (score >= HARD_BAN) {
    return res.status(403).json({ error: 'IP blocked' });
  }

  if (score >= SOFT_BAN) {
    await new Promise((r) => setTimeout(r, 1500));
  }

  const updateScore = async (delta: number) => {
    if (delta <= 0) return;

    await connection.multi().incrby(key, delta).expire(key, DECAY_SECONDS).exec();
  };

  const evaluate = async () => {
    let delta = 0;

    if (res.statusCode === 401) delta += 10;
    if (res.statusCode === 404) delta += 2;
    if (res.statusCode === 429) delta += 15;
    if (res.statusCode >= 500) delta += 5;

    if (req.headers['user-agent']?.includes('bot')) {
      delta += 10;
    }

    await updateScore(delta);
  };

  res.on('finish', evaluate);
  res.on('close', evaluate);

  next();
}
