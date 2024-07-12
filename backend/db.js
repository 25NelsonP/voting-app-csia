import express from "express";
import cors from "cors";
import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

// Access environment variables using process.env
const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const dbName = process.env.DB_NAME;

const app = express();
app.use(cors());
app.use(express.json());

// Create a connection to the database
export const pool = mysql
  .createPool({
    host: dbHost,
    user: dbUser,
    password: dbName,
    database: dbPass,
  })
  .promise();

app.listen(8080, () => {
  console.log("Hi! El es de backend!");
});
