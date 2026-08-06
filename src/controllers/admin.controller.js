import { adminModel } from '../models/admin.model.js';

export const adminController = {
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
};
