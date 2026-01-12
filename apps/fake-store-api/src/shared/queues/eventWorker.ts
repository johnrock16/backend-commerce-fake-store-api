import { Worker, Job } from 'bullmq';
import { connection } from '../redis/Redis';
import { eventDLQ } from './eventDLQ';
import { logger } from '../../shared/logger/Logger';
import { webhookService } from '../../shared/webhooks/WebhookService';
import { analyticsService } from '../../modules/analytics/AnalyticsService';
import { metricsService } from '../../shared/metrics/MetricsService';
import { operationalMetrics } from '../../shared/metrics/OperationalMetrics';

const worker = new Worker(
  'eventQueue',
  async (job: Job) => {
    try {
      logger.info(
        { jobId: job?.id, jobName: job?.name, correlationId: job?.data?.correlationId },
        `Processing job ${job.name}`,
      );

      // if (Math.random() < 0.3) {
      //   throw new Error("Fail simulation");
      // }

      switch (job.name) {
        case 'ProductCreated':
          logger.info(
            { jobId: job?.id, jobName: job?.name, correlationId: job?.data?.correlationId },
            `Webhook - ProductCreated`,
          );
          metricsService.increment('orders_created');
          await webhookService.trigger('ProductCreated', job.data);
          break;
        case 'OrderCreated':
          logger.info(
            { jobId: job?.id, jobName: job?.name, correlationId: job?.data?.correlationId },
            `Webhook - OrderCreated`,
          );
          metricsService.increment('products_created');
          await webhookService.trigger('OrderCreated', job.data);

          await analyticsService.trackPurchase({
            orderId: job.data.orderId,
            items: job.data.items.map((i: any) => ({
              productId: i.productId,
              quantity: i.quantity,
            })),
          });

          break;
        default:
          logger.warn(
            { jobId: job?.id, jobName: job?.name, correlationId: job?.data?.correlationId },
            `Evento uknown`,
          );
      }
    } catch (err) {
      logger.error(
        {
          jobId: job?.id,
          name: job?.name,
          error: err?.message,
          correlationId: job?.data?.correlationId,
        },
        'Job failed',
      );

      if (job.attemptsMade >= (job.opts.attempts || 0)) {
        logger.info(
          { jobId: job.id, name: job.name, correlationId: job?.data?.correlationId },
          'Job send to Dead Letter Queue',
        );
        await eventDLQ.add(job.name, job.data);
      }

      throw err;
    }
  },
  {
    connection,
    settings: {
      backoffStrategies: {},
    },
  },
);

worker.on('completed', (job) => {
  logger.info(
    { jobId: job?.id, jobName: job?.name, correlationId: job?.data?.correlationId },
    'Job completed',
  );
  metricsService.increment('jobs_completed');
  operationalMetrics.jobCompleted(
    String(job.id),
    job.processedOn && job.finishedOn ? job.finishedOn - job.processedOn : 0,
  );
});

worker.on('failed', (job, err) => {
  logger.error(
    {
      jobId: job?.id,
      name: job?.name,
      error: err?.message,
      correlationId: job?.data?.correlationId,
    },
    'Job failed',
  );
  metricsService.increment('jobs_failed');
  operationalMetrics.jobFailed(String(job?.id), err?.message || 'unknown');
});
