import "dotenv/config";
import readline from "node:readline/promises";
import { randomUUID } from "node:crypto";
import bcrypt from "bcrypt";
import { pool } from "../src/db.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

try {
  const username = (await rl.question("Admin username: ")).trim();
  const password = await rl.question("Admin password (12+ characters): ");

  if (username.length < 3 || password.length < 12) {
    throw new Error("Username needs 3+ characters and password 12+ characters");
  }

  //? 12 is the hashing cost: higher is slower, so harder to crack
  const passwordHash = await bcrypt.hash(password, 12);

  await pool.query(
    "INSERT INTO admins (id, username, password_hash) VALUES (?, ?, ?)",
    [randomUUID(), username, passwordHash],
  );

  console.log("Admin created");
} catch (err) {
  console.error(
    err.code === "ER_DUP_ENTRY" ? "This username already exists" : err.message,
  );
} finally {
  rl.close();
  await pool.end();
}
