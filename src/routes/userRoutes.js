import { userController } from '../controllers/users.controller';

export const userRouter = express.Router();

// 1. GET all users
userRouter.get('/', userController.getAllUsers);
