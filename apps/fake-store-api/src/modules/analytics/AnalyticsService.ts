import { logger } from '../../shared/logger/Logger';

export interface PurchaseEvent {
  orderId: string;
  items: { productId: string; quantity: number; price: number }[];
}

export class AnalyticsService {
  async trackPurchase(event: PurchaseEvent) {
    logger.info({ analytics: JSON.stringify(event) }, '[Analytics] Purchase Event:');

    // await axios.post("https://www.google-analytics.com/mp/collect?...", payload);
  }
}

export const analyticsService = new AnalyticsService();
