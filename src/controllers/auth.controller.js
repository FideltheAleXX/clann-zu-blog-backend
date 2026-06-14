import bcrypt from 'bcrypt';
import { userModel } from '../models/user.model.js';
import jwt from 'jsonwebtoken';

export const authController = {
  registration: async (req, res) => {
    try {
      let { email, nickname, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: 'Email and password are required fields' });
      }

      email = email.toLowerCase().trim();

      if (!nickname || nickname.trim() === '') {
        nickname = email;
      } else {
        nickname = nickname.trim();
      }

      const existingUsers = await userModel.validateNickOrEmail(
        email,
        nickname,
      );

      if (existingUsers.length > 0) {
        const isEmailTaken = existingUsers.some(
          (user) => user.email.toLowerCase() === email,
        );
        const isNicknameTaken = existingUsers.some(
          (user) => user.nickname.toLowerCase() === nickname,
        );

        if (isEmailTaken) {
          return res
            .status(400)
            .json({ message: 'User with same email already exists' });
        }
        if (isNicknameTaken) {
          return res.status(400).json({ message: 'Nickname already exists' });
        }
      }

      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      const newUser = await userModel.registrUser(
        email,
        nickname,
        passwordHash,
      );

      return res.status(201).json({
        message: 'User registred successfully.',
        user: newUser,
      });
    } catch (error) {
      console.error('Registration error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  },
  login: async (req, res) => {
    try {
      let { loginIdentifier, password } = req.body;

      if (!loginIdentifier || !password) {
        return res.status(400).json({ message: 'All fields are required' });
      }
      loginIdentifier = loginIdentifier.toLowerCase().trim();

      const user = await userModel.getUserByEmailOrNickname(loginIdentifier);

      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isPasswordCorrect = await bcrypt.compare(
        password,
        user.password_hash,
      );

      if (!isPasswordCorrect) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });

      return res.status(200).json({
        message: 'Logged in successfully',
        token,
        user: {
          id: user.id,
          email: user.email,
          nickname: user.nickname,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },
};
