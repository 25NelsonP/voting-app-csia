import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.js";
import electionRoutes from "./routes/election.js";
import groupRoutes from "./routes/groups.js";

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());

app.use("/users", userRoutes);
app.use("/elections", electionRoutes);
app.use("/groups", groupRoutes);

app.listen(8080, () => {
  console.log("Hi! El es de backend!");
});
