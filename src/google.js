import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import 'dotenv/config';

const app = express();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const email = profile.emails[0]?.value;
        const name = profile.displayName;
        const avatar = profile.photos[0]?.value;

        const user = { id: googleId, email, name, avatar };
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);

app.use(passport.initialize());

app.get(
  '/api/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] }),
);

app.get(
  '/api/auth/google/callback',
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/login',
  }),
  (req, res) => {
    res.json({ message: 'Успешный вход через Google', user: req.user });
  },
);

app.listen(3000, () => console.log('Server running on port 3000'));
