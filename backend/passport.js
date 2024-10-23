import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "./models/User.js";
import jwt from "jsonwebtoken";

dotenv.config();

const googleClientId = process.env.CLIENT_ID;
const googleClientSecret = process.env.CLIENT_SECRET;
const jwtSecret = process.env.JWT_SECRET;

passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: "/auth/google/redirect",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists in the database
        let user = await User.findOne({ where: { google_id: profile.id } });

        // If not found by google_id, check by email
        if (!user) {
          user = await User.findOne({
            where: { email: profile.emails[0].value },
          });

          // If found by email, update the user with google_id and possibly the name
          if (user) {
            user.google_id = profile.id;

            if (user.name !== profile.displayName) {
              user.name = profile.displayName;
            }

            if (user.email !== profile.emails[0].value) {
              user.email = profile.emails[0].value;
            }

            await user.save();
          } else {
            // Create a new user if no match found by google_id or email
            user = await User.create({
              name: profile.displayName,
              email: profile.emails[0].value,
              is_admin: false,
              google_id: profile.id,
            });
          }
        } else {
          // Update the user if the name or email has changed
          if (user.name !== profile.displayName) {
            user.name = profile.displayName;
            await user.save();
          }

          if (user.email !== profile.emails[0].value) {
            user.email = profile.emails[0].value;
            await user.save();
          }
        }

        // Create JWT token
        const token = jwt.sign(
          {
            user_id: user.user_id,
          },
          jwtSecret,
          { expiresIn: "1d" }
        );

        return done(null, { user, token });
      } catch (error) {
        return done(error);
      }
    }
  )
);

export default passport;
