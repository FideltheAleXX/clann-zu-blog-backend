import { adminModel } from '../models/admin.model.js';

export const adminController = {
  getAllUsers: async (req, res) => {
    try {
      const users = await adminModel.getAllUsers();
      return res.json(users);
    } catch (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  },
  getUserById: async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      if (Number.isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user id' });
      }

      const user = await adminModel.getUserById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.json(user);
    } catch (err) {
      console.error('Error fetching user by id:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  },
  makeEditor: async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      if (Number.isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user id' });
      }

      const user = await adminModel.makeEditor(userId);
      if (!user) return res.status(404).json({ error: 'User not found' });

      return res.json({ message: 'Editor role assigned', user });
    } catch (err) {
      console.error('Error assigning editor role:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  },
  changeNickname: async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      if (Number.isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user id' });
      }

      const { nickname } = req.body;
      const result = await adminModel.updateNickname(userId, nickname);
      if (result.error === 'NOT_FOUND') {
        return res.status(404).json({ error: 'User not found' });
      }
      if (result.error === 'NICKNAME_TAKEN') {
        return res.status(409).json({ error: 'Nickname is already taken' });
      }
      return res.json({
        message: 'Nickname updated successfully',
        user: result.user,
      });
    } catch (err) {
      console.error('Error changing user`s nickname:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  },
  changeStatus: async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      if (Number.isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid user id' });
      }

      if (req.user.id === userId) {
        return res
          .status(400)
          .json({ error: 'You cannot change your own status' });
      }

      const { status } = req.body;
      const result = await adminModel.changeStatus(userId, status);
      if (result.error === 'NOT_FOUND') {
        return res.status(404).json({ error: 'User not found' });
      }
      if (result.error === 'CANNOT_BAN_ADMIN') {
        return res
          .status(403)
          .json({ error: 'Cannot change status of another admin' });
      }
      return res.json({
        message: `Status successfully changed to "${status}"`,
        user: result.user,
      });
    } catch (err) {
      console.error('Error assigning editor role:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  },
};
