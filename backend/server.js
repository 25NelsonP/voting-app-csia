import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import dotenv from "dotenv";
import userRoutes from "./routes/user.js";
import electionRoutes from "./routes/election.js";
import groupRoutes from "./routes/groups.js";
import "./passport.js";

dotenv.config();

const app = express();

app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
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
  if (req.isAuthenticated()) {
    res.json(req.user);
  } else {
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

app.get(
  "/auth/google/redirect",
  passport.authenticate("google", {
    failureRedirect: "/",
  }),
  // middleware for user add or create
  function (req, res) {
    res.redirect(process.env.ORIGIN);
  }
);

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

export default app;
