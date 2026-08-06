import express from 'express';
import { adminController } from '../controllers/admin.controller.js';
import { ROLES } from '../constants/roles.js';

export const adminRouter = express.Router();

adminRouter.put(
  '/users/:userId/role',
  checkRole(ROLES.ADMIN),
  adminController.makeEditor,
);
