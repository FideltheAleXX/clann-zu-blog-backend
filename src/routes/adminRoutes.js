import express from 'express';
import { adminController } from '../controllers/admin.controller.js';
import { ROLES } from '../constants/roles.js';
import { checkRole } from '../middleware/checkRole.js';
import { checkAuth } from '../middleware/checkAuth.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  updateNicknameSchema,
  updateStatusSchema,
} from '../validators/adminValidator.js';

export const adminRouter = express.Router();

// Get All Users
adminRouter.get(
  '/users',
  checkAuth,
  checkRole(ROLES.ADMIN),
  adminController.getAllUsers,
);

// Get One User
adminRouter.get(
  '/users/:userId',
  checkAuth,
  checkRole(ROLES.ADMIN),
  adminController.getUserById,
);

// Make user the Editor
adminRouter.put(
  '/users/:userId/role',
  checkAuth,
  checkRole(ROLES.ADMIN),
  adminController.makeEditor,
);

// Update user`s Nickname
adminRouter.patch(
  '/users/:userId/nickname',
  checkAuth,
  checkRole(ROLES.ADMIN),
  validateRequest(updateNicknameSchema),
  adminController.changeNickname,
);

// Ban user
adminRouter.patch(
  '/users/:userId/status',
  checkAuth,
  checkRole(ROLES.ADMIN),
  validateRequest(updateStatusSchema),
  adminController.changeStatus,
);
