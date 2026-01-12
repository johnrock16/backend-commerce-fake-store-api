import axios from 'axios';
import { WebhookPrismaRepository } from '../../modules/webhooks/infra/prisma/WebhookPrismaRepository';
import { operationalMetrics } from '../metrics/OperationalMetrics';
import { logger } from '../../shared/logger/Logger';
import { signWebhook } from '../../modules/webhooks/application/WebhookSigner';

export interface Webhook {
  url: string;
  event: string;
}

export class WebhookService {
  private repo = new WebhookPrismaRepository();
  private webhooks: Webhook[] = [];

  register(webhook: Webhook) {
    this.webhooks.push(webhook);
  }

  async trigger(event: string, payload: any) {
    const targets = await this.repo.findByEvent(event);

    await Promise.all(
      targets.map(async (w) => {
        try {
          const start = Date.now();
          const timestamp = start.toString();
          const body = JSON.stringify(payload);

          const signature = signWebhook({
            webhookId: w.id,
            secret: w.secret,
            timestamp,
            body,
          });

          await axios.post(w.url, payload, {
            headers: {
              'X-Webhook-Id': w.id,
              'X-Webhook-Timestamp': timestamp,
              'X-Webhook-Signature': signature,
            },
          });

          logger.info(
            { webhookURL: w.url, event: event, correlationId: payload?.data?.correlationId },
            'Webhook sent',
          );
          await operationalMetrics.webhookSent(w.id, Date.now() - start);
        } catch (err) {
          logger.error(
            { webhookURL: w.url, event: event, correlationId: payload?.data?.correlationId },
            'Webhook failed',
          );
          await operationalMetrics.webhookFailed(w.id, (err as Error).message);
        }
      }),
    );
  }
}

export const webhookService = new WebhookService();
