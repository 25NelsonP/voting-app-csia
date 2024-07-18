import express from "express";
import cors from "cors";
import pool from "./db.js"; // Ensure db.js uses ES module syntax as described earlier
import apiRoutes from "./routes/api.js"; // Adjust the path as necessary

const app = express();
app.use(cors());
app.use(express.json());

app.listen(8000, () => {
  console.log("Hi! El es de backend!");
});
