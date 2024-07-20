import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.js";
import electionRoutes from "./routes/election.js";

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());

app.use(userRoutes);
app.use(electionRoutes);

app.listen(8080, () => {
  console.log("Hi! El es de backend!");
});
