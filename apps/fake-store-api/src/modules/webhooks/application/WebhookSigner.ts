import crypto from 'crypto';

type signWebhookParameters = {
  webhookId: string;
  secret: string;
  timestamp: string;
  body: string;
};

export function signWebhook({ webhookId, secret, timestamp, body }: signWebhookParameters) {
  const payload = `${webhookId}.${timestamp}.${body}`;

  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}
