import { prisma } from '../../../../shared/prisma/Prisma';
import { Product as PrismaProduct } from '../../../../generated/prisma/client';

export class ProductPrismaRepository {
  async create(name: string, price: number): Promise<PrismaProduct> {
    return prisma.product.create({
      data: { name, price },
    });
  }

  async findAll(): Promise<PrismaProduct[]> {
    return prisma.product.findMany();
  }
}
