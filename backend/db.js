import { Sequelize } from "sequelize";
import mysql2 from "mysql2";
import dotenv from "dotenv";

// Load environment variables from a .env file if not in production
// for future deployments not vercel
// if (process.env.NODE_ENV !== 'production') {
//   dotenv.config({
//       path: process.env.NODE_ENV === 'staging' ? '.env.staging' : '.env.local'
//   });
// }

dotenv.config();
// Define the Sequelize configuration
const db = new Sequelize(
  process.env.DB_NAME, // The database name
  process.env.DB_USER, // The database user
  process.env.DB_PASS, // The password for the database user
  {
    host: process.env.DB_HOST, // The database host
    port: process.env.DB_PORT, // The port to connect to
    dialect: "mysql", // The type of database
    dialectModule: mysql2, // The mysql2 module for MySQL connection
    logging: false, // Disabled, but could Enable logging for debugging purposes
    dialectOptions:
      process.env.NODE_ENV === "production"
        ? {
            ssl: {
              require: true, // Enforce SSL connection
              rejectUnauthorized: false, // Allows self-signed certificates
              ca: process.env.CA_CERT, // Path to the CA certificate
            },
          }
        : {}, // Empty object for non-production (no SSL configuration)
  }
);

export default db;
