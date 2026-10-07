import { prisma } from '../config/db.js';

export const adminModel = {
  getAllUsers: async () => {
    return prisma.users.findMany({
      select: {
        id: true,
        email: true,
        nickname: true,
        role: true,
        status: true,
        created_at: true,
        google_id: true,
        _count: {
          select: { posts: true },
        },
      },
      orderBy: { id: 'desc' },
    });
  },
  getUserById: async (userId) => {
    const id = Number(userId);
    if (Number.isNaN(id)) throw new Error('Invalid user id');
    const user = await prisma.users.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        nickname: true,
        role: true,
        status: true,
        created_at: true,
        google_id: true,
        _count: {
          select: { posts: true },
        },
        posts: {
          select: {
            id: true,
            title: true,
            created_at: true,
          },
          orderBy: { created_at: 'desc' },
          take: 10,
        },
      },
    });
    return user;
  },
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
  updateNickname: async (userId, newNickname) => {
    const id = Number(userId);
    if (Number.isNaN(id)) throw new Error('Invalid user id');

    const normalizedNick = newNickname.trim();

    const existing = await prisma.users.findUnique({ where: { id } });
    if (!existing) return { error: 'NOT_FOUND' };

    const existingNick = await prisma.users.findFirst({
      where: {
        nickname: { equals: normalizedNick, mode: 'insensitive' },
        NOT: { id },
      },
    });

    if (existingNick) {
      return { error: 'NICKNAME_TAKEN' };
    }

    const user = await prisma.users.update({
      where: { id },
      data: { nickname: normalizedNick },
      select: { id: true, email: true, nickname: true, role: true },
    });

    return { user };
  },
  changeStatus: async (userId, newStatus) => {
    const id = Number(userId);
    if (Number.isNaN(id)) throw new Error('Invalid user id');

    const user = await prisma.users.findUnique({ where: { id } });
    if (!user) return null;

    if (user.role === 'admin') {
      return { error: 'CANNOT_BAN_ADMIN' };
    }

    const updatedUser = await prisma.users.update({
      where: { id },
      data: { status: newStatus },
      select: {
        id: true,
        email: true,
        nickname: true,
        role: true,
        status: true,
      },
    });

    return { user: updatedUser };
  },
};
