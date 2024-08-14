import express from "express";
import cors from "cors";
import passport from "passport";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.js";
import electionRoutes from "./routes/election.js";
import groupRoutes from "./routes/groups.js";
import voteRoutes from "./routes/vote.js";
import permissionRoutes from "./routes/permissions.js";
import User from "./models/User.js";
import "./passport.js";

dotenv.config();

const app = express();

// Custom middleware to enforce origin checks with exceptions
app.use((req, res, next) => {
  const allowedOrigin = process.env.ORIGIN;
  const openRoutes = ["/auth/google/redirect"];

  // Check if the route is in the openRoutes array
  if (openRoutes.includes(req.path)) {
    return next(); // Skip origin check for these routes
  }

  // Check for `Referer` or `Host` header
  const referer = req.headers.referer || "";
  const host = req.headers.host || "";

  if (
    referer.startsWith(allowedOrigin) ||
    host === allowedOrigin.replace(/^https?:\/\//, "")
  ) {
    next();
  } else {
    res.status(403).send("Access forbidden: Unauthorized origin");
  }
});

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use(passport.initialize());

//Google Authentication
app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

//Google Authentication Redirect
app.get(
  "/auth/google/redirect",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${process.env.ORIGIN}/login`,
  }),
  (req, res) => {
    const token = req.user.token;
    res.redirect(`${process.env.ORIGIN}/auth/callback?token=${token}`);
  }
);

// Verify JWT token on every request
app.get("/auth/user", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.user_id;

    const user = await User.findOne({ where: { user_id: userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: "Invalid token", err });
  }
});

// Routes
app.use("/users", userRoutes);
app.use("/elections", electionRoutes);
app.use("/groups", groupRoutes);
app.use("/votes", voteRoutes);
app.use("/permissions", permissionRoutes);

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

export default app;
