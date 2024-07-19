import express from "express";
import cors from "cors";
import apiRoutes from "./routes/user.js"; // Adjust the path as necessary

const app = express();
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(express.json());

app.use(apiRoutes);

app.listen(8080, () => {
  console.log("Hi! El es de backend!");
});
