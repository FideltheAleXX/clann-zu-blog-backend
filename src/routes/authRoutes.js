import express from 'express';
import { authController } from '../controllers/auth.controller.js';

export const authRouter = express.Router();

// 1. Registration
authRouter.post('/reg', authController.registration);

// 2. Log In
authRouter.post('/login', authController.login);
