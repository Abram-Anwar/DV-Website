import mysql from "mysql2/promise";

//? A pool keeps a few connections open and reuses them (faster)
export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  charset: "utf8mb4", // needed for Arabic text
  waitForConnections: true,
  connectionLimit: 10,
});