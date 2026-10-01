import 'dotenv/config';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { userModel } from '../models/user.model.js';

export const googleAuthConfigured = Boolean(
  process.env.GOOGLE_CLIENT_ID &&
  process.env.GOOGLE_CLIENT_SECRET &&
  process.env.GOOGLE_CALLBACK_URL,
);

if (googleAuthConfigured) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          const emailVerified =
            profile._json?.email_verified ?? profile._json?.verified_email;

          if (!email || emailVerified !== true) {
            return done(new Error('Google account must have a verified email'));
          }

          const user = await userModel.findOrCreateGoogleUser(
            profile.id,
            email,
          );
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      },
    ),
  );
}
