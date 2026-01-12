import { prisma } from '../../../../shared/prisma/Prisma';
import type { Order } from '../../../../generated/prisma/client';

export class OrderPrismaRepository {
  async create(items: { productId: string; quantity: number }[]): Promise<Order> {
    return prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          status: 'CREATED',
          items: {
            create: items.map((i) => ({
              productId: i.productId,
              quantity: i.quantity,
            })),
          },
        },
        include: { items: true },
      });

      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return order;
    });
  }

  async findAll(): Promise<Order[]> {
    return prisma.order.findMany({
      include: { items: { include: { product: true } } },
    });
  }
}
