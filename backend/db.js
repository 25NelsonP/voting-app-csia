import mysql from "mysql2";

// Create a connection to the database
const pool = mysql
  .createPool({
    host: "localhost",
    user: "root",
    password: "1234root#",
    database: "votingsys",
  })
  .promise();

module.exports = pool;
