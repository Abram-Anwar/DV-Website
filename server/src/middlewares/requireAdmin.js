import jwt from "jsonwebtoken";
import { pool } from "../db.js";

export const COOKIE_NAME = "admin_token";

//? Lets the request continue only if it carries a valid admin cookie
export async function requireAdmin(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) {
    return res.status(401).json({ message: "Not logged in" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"],
    });

    //? The admin must still exist (a deleted admin loses access immediately)
    const [rows] = await pool.query(
      "SELECT id, username FROM admins WHERE id = ?",
      [payload.sub],
    );
    if (rows.length === 0) {
      return res.status(401).json({ message: "Not logged in" });
    }

    req.admin = rows[0];
    next();
  } catch (err) {
    //? Invalid or expired token
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Not logged in" });
    }
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}
