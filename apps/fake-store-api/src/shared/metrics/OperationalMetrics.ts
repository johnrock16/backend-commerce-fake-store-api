import { prisma } from '../../shared/prisma/Prisma';

class OperationalMetrics {
  async jobCompleted(jobId: string, duration: number) {
    return prisma.operationalMetric.create({
      data: {
        type: 'job',
        name: 'completed',
        refId: jobId,
        duration,
      },
    });
  }

  async jobFailed(jobId: string, error: string) {
    return prisma.operationalMetric.create({
      data: {
        type: 'job',
        name: 'failed',
        refId: jobId,
        meta: { error },
      },
    });
  }

  async webhookSent(webhookId: string, duration: number) {
    return prisma.operationalMetric.create({
      data: {
        type: 'webhook',
        name: 'sent',
        refId: webhookId,
        duration,
      },
    });
  }

  async webhookFailed(webhookId: string, error: string) {
    return prisma.operationalMetric.create({
      data: {
        type: 'webhook',
        name: 'failed',
        refId: webhookId,
        meta: { error },
      },
    });
  }
}

export const operationalMetrics = new OperationalMetrics();
