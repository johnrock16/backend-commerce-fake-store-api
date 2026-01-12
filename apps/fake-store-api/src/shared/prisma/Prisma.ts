import { PrismaClient } from '../../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: 'postgresql://fakestore:fakestore@localhost:5432/fakestore',
});

export const prisma = new PrismaClient({ adapter });
