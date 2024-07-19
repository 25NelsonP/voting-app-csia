import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

// Access environment variables using process.env
const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const dbName = process.env.DB_NAME;

// Create a connection to the database
const pool = mysql.createPool({
  host: dbHost,
  user: dbUser,
  password: dbPass,
  database: dbName,
});

export default pool;
