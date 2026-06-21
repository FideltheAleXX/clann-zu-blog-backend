import { pool } from '../config/db.js';

export const userModel = {
  validateNickOrEmail: async (email, nickname) => {
    const query = `
    SELECT * FROM users 
    WHERE LOWER(email) = $1 OR LOWER(nickname) = $2
  `;
    return (
      await pool.query(query, [email.toLowerCase(), nickname.toLowerCase()])
    ).rows;
  },
  registrUser: async (email, nickname, passwordHash) => {
    const query = `
    INSERT INTO users (email, nickname, password_hash) 
    VALUES ($1, $2, $3) 
    RETURNING id, email, nickname, role
  `;
    const result = await pool.query(query, [
      email.toLowerCase(),
      nickname,
      passwordHash,
    ]);
    return result.rows[0];
  },
  getUserByEmailOrNickname: async (loginIdentifier) => {
    const normalizedIdentifier = loginIdentifier.toLowerCase().trim();

    const query = `
    SELECT * FROM users 
    WHERE LOWER(email) = $1 OR LOWER(nickname) = $1
  `;
    const result = await pool.query(query, [normalizedIdentifier]);
    return result.rows[0];
  },
};
