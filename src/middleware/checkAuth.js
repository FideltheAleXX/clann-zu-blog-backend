import dotenv from 'dotenv';
dotenv.config();

import jwt from 'jsonwebtoken';
import { prisma } from '../config/db.js';

export const checkAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Error (token missed)' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const JWT_SECRET = process.env.JWT_SECRET;

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await prisma.users.findUnique({
      where: { id: decoded.id },
      select: { id: true, role: true, status: true },
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (user.status === 'banned') {
      return res.status(403).json({ message: 'Account is banned' });
    }

    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Incorrect token' });
  }
};
