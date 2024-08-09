import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import User from "./models/User.js"; // Import the Sequelize User model

dotenv.config();

const googleClientId = process.env.CLIENT_ID;
const googleClientSecret = process.env.CLIENT_SECRET;

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
        let user = await User.findOne({ where: { googleId: profile.id } });

        if (user) {
          // User found
          return done(null, user);
        } else {
          // User not found, create new user
          user = await User.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            is_admin: false,
            googleId: profile.id,
          });

          return done(null, user);
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  console.log("serializing user");
  done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
  console.log("Deserializing user with ID:", id);
  try {
    const user = await User.findByPk(id);
    if (user) {
      console.log("User found:", user);
      done(null, user);
    } else {
      console.log("User not found");
      done(null, false);
    }
  } catch (err) {
    console.log("Error during deserialization:", err);
    done(err);
  }
});

export default passport;
