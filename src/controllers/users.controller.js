import { userModel } from '../models/user.model.js';

export const userController = {
  getAllUsers: async () => {
    try {
      const users = await userModel.getAll();

      res.json(users);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
    }
  },
};
