import express from 'express';
import { authController } from '../controllers/auth.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  registrationSchema,
  loginSchema,
} from '../validators/authValidator.js';

export const authRouter = express.Router();

// 1. Registration
authRouter.post(
  '/reg',
  validateRequest(registrationSchema),
  authController.registration,
);

// 2. Log In
authRouter.post('/login', validateRequest(loginSchema), authController.login);
