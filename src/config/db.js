import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.on('connect', () => {
  console.log('Successfully connect to PostgreSQL');
});

pool.on('error', (err) => {
  console.error('Error in pool PostgreSQL:', err);
  process.exit(-1);
});
