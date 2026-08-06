import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export { prisma };

export const pool = {
  query: () => {
    throw new Error(
      "Legacy 'pool.query' is not supported anymore. Import 'prisma' from '../config/db.js' and use Prisma Client API instead.",
    );
  },
};
