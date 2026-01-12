import crypto from 'crypto';
import { prisma } from '../../../../shared/prisma/Prisma';
import { Webhook } from '../../../../generated/prisma/client';

export class WebhookPrismaRepository {
  async create(url: string, event: string): Promise<Webhook> {
    const secret = crypto.randomBytes(32).toString('hex');

    return prisma.webhook.create({ data: { url, event, secret } });
  }

  async findByEvent(event: string): Promise<Webhook[]> {
    return prisma.webhook.findMany({ where: { event } });
  }

  async findAll(): Promise<Webhook[]> {
    return prisma.webhook.findMany();
  }

  async delete(id: string): Promise<void> {
    await prisma.webhook.delete({ where: { id } });
  }
}
