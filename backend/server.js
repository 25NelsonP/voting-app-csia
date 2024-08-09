import express from "express";
import cors from "cors";
import session from "express-session";
import SequelizeStore from "connect-session-sequelize";
import passport from "passport";
import dotenv from "dotenv";
import userRoutes from "./routes/user.js";
import electionRoutes from "./routes/election.js";
import groupRoutes from "./routes/groups.js";
import sequelize from "./db.js";
import "./passport.js";

dotenv.config();

const app = express();
const SequelizeSessionStore = SequelizeStore(session.Store);

const sessionStore = new SequelizeSessionStore({
  db: sequelize,
});

if (process.env.NODE_ENV === "local") {
  sessionStore
    .sync()
    .then(() => console.log("Session store synced"))
    .catch((err) => console.error("Error syncing session store:", err));
}

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only secure in production
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // lax for local testing
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);
app.use(express.json());

app.use("/users", userRoutes);
app.use("/elections", electionRoutes);
app.use("/groups", groupRoutes);

app.get("/", (req, res) => {
  res.send('<a href="auth/google">Authenticate with Google</a>');
});

app.get("/auth/user", (req, res) => {
  console.log("User:", req.user);
  console.log("Session:", req.session);
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
    console.log("User:", req.user);
    console.log("Session:", req.session);
    res.status(401).json({ error: "Not authenticated" });
  }
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

app.get("/test", (req, res) => {
  res.json({ session: req.session, user: req.sessionID });
});

app.get(
  "/auth/google/redirect",
  passport.authenticate("google", {
    failureRedirect: "/",
  }),

  function (req, res) {
    res.redirect(process.env.ORIGIN);
  }
);

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

export default app;
