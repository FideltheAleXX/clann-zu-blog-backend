import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { postRouter } from './src/routes/routes.js';
import { authRouter } from './src/routes/authRoutes.js';
import './src/config/db.js';
import { xmlRouter } from './src/routes/xmlRoutes.js';
import { userRouter } from './src/routes/userRoutes.js';
import { adminRouter } from './src/routes/adminRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  //разработка
  'http://localhost:5173',
  'https://clann-zu-react.vercel.app',
  'https://clann-zu.com',
  'https://www.clann-zu.com',
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello. Server is ready.');
});

app.use('/posts', postRouter);
app.use('/auth', authRouter);
app.use('/sitemap.xml', xmlRouter);
app.use('/users', userRouter);
app.use('/admin', adminRouter);

app.listen(PORT, () => {
  console.log(`Server is ready on http://localhost:${PORT}`);
});
