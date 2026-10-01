import express from 'express';
import passport from 'passport';
import { authController } from '../controllers/auth.controller.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  registrationSchema,
  loginSchema,
} from '../validators/authValidator.js';

export const authRouter = express.Router();

authRouter.use(passport.initialize());

// 1. Registration
authRouter.post(
  '/reg',
  validateRequest(registrationSchema),
  authController.registration,
);

// 2. Log In
authRouter.post('/login', validateRequest(loginSchema), authController.login);

// 3. Log Out
authRouter.post('/logout', authController.logout);

// 4. OAuth2.0 via Google
authRouter.get('/google', authController.startGoogleAuthentication);

authRouter.get('/google/callback', authController.googleCallback);
