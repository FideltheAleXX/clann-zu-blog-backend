import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { postRouter } from './src/routes/routes.js';
import { authRouter } from './src/routes/authRoutes.js';
import './src/config/db.js';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello. Server is ready.');
});

app.use('/posts', postRouter);
app.use('/auth', authRouter);

app.listen(PORT, () => {
  console.log(`Server is ready on http://localhost:${PORT}`);
});
