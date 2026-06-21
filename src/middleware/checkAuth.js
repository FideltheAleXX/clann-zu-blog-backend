import dotenv from 'dotenv';
dotenv.config();

import jwt from 'jsonwebtoken';

export const checkAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Error (token missed)' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const JWT_SECRET = process.env.JWT_SECRET;

    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = { id: decoded.id, role: decoded.role || 'user' };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Incorrect token' });
  }
};
