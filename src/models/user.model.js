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
  findOrCreateGoogleUser: async (googleId, email, displayName) => {
    const existingGoogleUser = await prisma.users.findUnique({
      where: { google_id: googleId },
    });

    if (existingGoogleUser) {
      return { ...existingGoogleUser, isNewUser: false };
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existingEmailUser = await prisma.users.findFirst({
      where: { email: { equals: normalizedEmail, mode: 'insensitive' } },
    });

    if (existingEmailUser) {
      if (existingEmailUser.google_id) {
        throw new Error('Email is already linked to another Google account');
      }
      const updatedUser = await prisma.users.update({
        where: { id: existingEmailUser.id },
        data: { google_id: googleId },
      });
      return { ...updatedUser, isNewUser: false };
    }

    let nickname = (displayName || normalizedEmail.split('@')[0]).trim();
    const existingNick = await prisma.users.findFirst({
      where: { nickname: { equals: nickname, mode: 'insensitive' } },
    });
    if (existingNick) {
      nickname = `${nickname}_${Math.floor(1000 + Math.random() * 9000)}`;
    }

    const newUser = await prisma.users.create({
      data: {
        email: normalizedEmail,
        google_id: googleId,
        nickname,
      },
    });

    return { ...newUser, isNewUser: true };
  },
  getAll: async () => {
    return prisma.users.findMany({
      select: {
        id: true,
        email: true,
        nickname: true,
        role: true,
        created_at: true,
      },
      orderBy: { id: 'desc' },
    });
  },
};
