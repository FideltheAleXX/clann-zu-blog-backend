import { prisma } from '../config/db.js';

export const adminModel = {
  makeEditor: async (userId) => {
    const id = Number(userId);
    if (Number.isNaN(id)) throw new Error('Invalid user id');

    const existing = await prisma.users.findUnique({ where: { id } });
    if (!existing) return null;

    const user = await prisma.users.update({
      where: { id },
      data: { role: 'editor' },
      select: { id: true, email: true, nickname: true, role: true },
    });

    return user;
  },
};
