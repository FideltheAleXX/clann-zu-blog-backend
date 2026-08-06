import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.ts';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });
export { prisma };

export const pool = {
  query: () => {
    throw new Error(
      "Legacy 'pool.query' is not supported anymore. Import 'prisma' from '../config/db.js' and use Prisma Client API instead.",
    );
  },
};
