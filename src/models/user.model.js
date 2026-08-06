import { prisma } from '../config/db.js';

export const userModel = {
  validateNickOrEmail: async (email, nickname) => {
    const users = await prisma.users.findMany({
      where: {
        OR: [
          { email: { equals: email.toLowerCase(), mode: 'insensitive' } },
          { nickname: { equals: nickname.toLowerCase(), mode: 'insensitive' } },
        ],
      },
    });
    return users;
  },
  registrUser: async (email, nickname, passwordHash) => {
    const user = await prisma.users.create({
      data: {
        email: email.toLowerCase(),
        nickname,
        password_hash: passwordHash,
      },
      select: { id: true, email: true, nickname: true, role: true },
    });
    return user;
  },
  getUserByEmailOrNickname: async (loginIdentifier) => {
    const normalizedIdentifier = loginIdentifier.toLowerCase().trim();
    const user = await prisma.users.findFirst({
      where: {
        OR: [
          { email: { equals: normalizedIdentifier, mode: 'insensitive' } },
          { nickname: { equals: normalizedIdentifier, mode: 'insensitive' } },
        ],
      },
    });
    return user;
  },
};
