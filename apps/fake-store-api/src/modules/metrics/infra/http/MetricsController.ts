import { Router } from 'express';
import { metricsService } from '../../../../shared/metrics/MetricsService';

export const metricsRouter = Router();

metricsRouter.get('/', (req, res) => {
  res.json(metricsService.getAll());
});
