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
        let user = await User.findOne({ where: { googleId: profile.id } });

        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            is_admin: false,
            googleId: profile.id,
          });
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
