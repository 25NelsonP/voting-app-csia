import express from "express";
import cors from "cors";
import passport from "passport";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.js";
import electionRoutes from "./routes/election.js";
import groupRoutes from "./routes/groups.js";
import "./passport.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use(passport.initialize());

app.get("/", (req, res) => {
  res.send('<a href="auth/google">Authenticate with Google</a>');
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
    session: false,
    failureRedirect: `${process.env.ORIGIN}/login`,
  }),
  (req, res) => {
    // Send JWT token in cookie
    res.cookie("jwt", req.user.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // lax for local testing,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    res.redirect(process.env.ORIGIN);
  }
);

app.get("/auth/user", (req, res) => {
  const token = req.cookies.jwt;
  if (!token) return res.status(401).json({ error: "Not authenticated" });

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: "Invalid token", err });
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.redirect(process.env.ORIGIN);
});

app.use("/users", userRoutes);
app.use("/elections", electionRoutes);
app.use("/groups", groupRoutes);

app.listen(8080, () => {
  console.log("Server is running on port 8080");
});

export default app;
