import { pool } from '../config/db.js';

export const postModel = {
  getAll: async () => {
    const result = await pool.query(`
      SELECT p.*, u.nickname as author 
FROM posts p
LEFT JOIN users u ON p.user_id = u.id
ORDER BY p.id DESC;
    `);
    return result.rows;
  },
  getById: async (id) => {
    const query = `
      SELECT p.*, u.nickname as author 
      FROM posts p
      LEFT JOIN users u ON p.user_id = u.id
      WHERE p.id = $1;
    `;
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  },
  createPost: async ({ title, content, author, img }) => {
    const query = `
        INSERT INTO posts (title, content, user_id, img) 
VALUES ($1, $2, $3, $4) 
RETURNING *;
    `;

    const values = [title, content, author, img];

    const { rows } = await pool.query(query, values);
    return rows[0];
  },
  updatePost: async (id, fields) => {
    const setParts = [];
    const values = [];
    let placeholderIndex = 1;

    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        setParts.push(`${key} = $${placeholderIndex}`);
        values.push(value);
        placeholderIndex++;
      }
    }

    if (setParts.length === 0) return null;

    values.push(id);
    const idPlaceholder = `$${placeholderIndex}`;

    const query = `
        UPDATE posts 
        SET ${setParts.join(', ')} 
        WHERE id = ${idPlaceholder} 
        RETURNING *;
    `;

    const { rows } = await pool.query(query, values);
    return rows[0];
  },
  deletePost: async (id) => {
    const query = 'DELETE FROM posts WHERE id = $1 RETURNING *;';

    const { rows } = await pool.query(query, [id]);

    return rows[0];
  },
};
