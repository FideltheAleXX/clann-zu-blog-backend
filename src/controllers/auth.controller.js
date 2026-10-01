import { randomBytes, timingSafeEqual } from 'node:crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { googleAuthConfigured } from '../config/passport.js';
import { userModel } from '../models/user.model.js';

const googleStateCookie = 'google_oauth_state';
const googleCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/auth/google',
};

const googleAuthUnavailable = (res) =>
  res.status(503).json({ message: 'Google authentication is not configured' });

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

      const token = jwt.sign(
        { id: user.id, role: user.role || 'user' },
        process.env.JWT_SECRET,
        {
          expiresIn: '7d',
        },
      );

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
  logout: async (req, res) => {
    return res.status(200).json({
      message: 'Logged out successfully',
    });
  },
  startGoogleAuthentication: (req, res, next) => {
    if (!googleAuthConfigured) {
      return googleAuthUnavailable(res);
    }

    const state = randomBytes(32).toString('base64url');
    res.cookie(googleStateCookie, state, {
      ...googleCookieOptions,
      maxAge: 5 * 60 * 1000,
    });

    return passport.authenticate('google', {
      scope: ['profile', 'email'],
      state,
    })(req, res, next);
  },
  googleCallback: (req, res, next) => {
    if (!googleAuthConfigured) {
      return googleAuthUnavailable(res);
    }

    const stateCookie = req.headers.cookie
      ?.split(';')
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith(`${googleStateCookie}=`))
      ?.slice(googleStateCookie.length + 1);
    const returnedState = req.query.state;

    res.clearCookie(googleStateCookie, googleCookieOptions);

    if (
      typeof returnedState !== 'string' ||
      !stateCookie ||
      Buffer.byteLength(returnedState) !== Buffer.byteLength(stateCookie) ||
      !timingSafeEqual(Buffer.from(returnedState), Buffer.from(stateCookie))
    ) {
      return res
        .status(401)
        .json({ message: 'Invalid Google authentication state' });
    }

    return passport.authenticate(
      'google',
      { session: false },
      (error, user) => {
        if (error) {
          console.error('Google authentication error:', error);
          return res
            .status(500)
            .json({ message: 'Google authentication failed' });
        }

        if (!user) {
          return res
            .status(401)
            .json({ message: 'Google authentication failed' });
        }

        try {
          const token = jwt.sign(
            { id: user.id, role: user.role || 'user' },
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
          );

          return res.status(200).json({
            message: 'Logged in successfully',
            token,
            user: {
              id: user.id,
              email: user.email,
              nickname: user.nickname,
            },
          });
        } catch (tokenError) {
          console.error('Google token creation error:', tokenError);
          return res
            .status(500)
            .json({ message: 'Google authentication failed' });
        }
      },
    )(req, res, next);
  },
};
