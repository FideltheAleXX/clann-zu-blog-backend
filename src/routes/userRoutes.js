import { userController } from '../controllers/users.controller.js';

export const userRouter = express.Router();

// 1. GET all users
userRouter.get('/', userController.getAllUsers);
