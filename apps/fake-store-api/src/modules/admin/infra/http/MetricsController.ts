import { Router } from 'express';
import { prisma } from '../../../../shared/prisma/Prisma';

export const adminMetricsRouter = Router();

adminMetricsRouter.get('/overview', async (_, res) => {
  const [jobs, webhooks] = await Promise.all([
    prisma.operationalMetric.groupBy({
      by: ['name'],
      where: { type: 'job' },
      _count: { name: true },
    }),
    prisma.operationalMetric.groupBy({
      by: ['name'],
      where: { type: 'webhook' },
      _count: { name: true },
    }),
  ]);

  res.json({ jobs, webhooks });
});

adminMetricsRouter.get('/latency', async (_, res) => {
  const jobs = await prisma.operationalMetric.aggregate({
    where: { type: 'job', duration: { not: null } },
    _avg: { duration: true },
  });

  const webhooks = await prisma.operationalMetric.aggregate({
    where: { type: 'webhook', duration: { not: null } },
    _avg: { duration: true },
  });

  res.json({
    jobsMs: Math.round(jobs._avg.duration || 0),
    webhooksMs: Math.round(webhooks._avg.duration || 0),
  });
});

adminMetricsRouter.get('/webhooks', async (_, res) => {
  const data = await prisma.operationalMetric.groupBy({
    by: ['refId', 'name'],
    where: { type: 'webhook' },
    _count: { name: true },
  });

  res.json(data);
});
