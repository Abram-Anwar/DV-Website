import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { pool } from "../db.js";
import { requireAdmin, COOKIE_NAME } from "../middlewares/requireAdmin.js";

const router = Router();

const loginSchema = z.object({
  username: z.string().trim().min(1).max(50),
  password: z.string().min(1).max(200),
});

//? Compared when the username does not exist, so the response time looks the same
const DUMMY_HASH = await bcrypt.hash("not-a-real-password", 12);

//? Max 10 login attempts per 15 minutes from the same IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: { message: "Too many attempts, try again later" },
});

router.post("/login", loginLimiter, async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid data" });
  }
  const { username, password } = parsed.data;

  try {
    const [rows] = await pool.query(
      "SELECT id, username, password_hash FROM admins WHERE username = ?",
      [username],
    );
    const admin = rows[0];

    const ok = await bcrypt.compare(
      password,
      admin ? admin.password_hash : DUMMY_HASH,
    );

    //? Same answer for a wrong username and a wrong password
    if (!admin || !ok) {
      return res.status(401).json({ message: "Wrong username or password" });
    }

    const token = jwt.sign({ sub: admin.id }, process.env.JWT_SECRET, {
      expiresIn: "8h",
    });

    //? httpOnly: JavaScript in the page cannot read the cookie
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 8 * 60 * 60 * 1000,
    });

    res.json({ username: admin.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not log in" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie(COOKIE_NAME);
  res.json({ ok: true });
});

//? Returns the logged-in admin (the frontend uses it to check the session)
router.get("/me", requireAdmin, (req, res) => {
  res.json({ username: req.admin.username });
});

//? Returns statistics for the admin dashboard
router.get("/overview", requireAdmin, async (req, res) => {
  try {
    // Applications statistics
    const [applicationRows] = await pool.query(`
  SELECT
    COUNT(*) AS totalApplications,

    COUNT(CASE
      WHEN application_status = 'submitted' THEN 1
    END) AS submittedApplications,

    COUNT(CASE
      WHEN application_status = 'not_submitted'
        AND EXISTS (
          SELECT 1
          FROM payments p
          WHERE p.application_id = applications.id
            AND p.payment_status = 'paid'
        )
      THEN 1
    END) AS readyToSubmitApplications,

    COUNT(CASE
      WHEN NOT EXISTS (
        SELECT 1
        FROM payments p
        WHERE p.application_id = applications.id
          AND p.payment_status = 'paid'
      )
      THEN 1
    END) AS unpaidApplications

  FROM applications
`);

    // Get payments statistics
    const [paymentRows] = await pool.query(`
      SELECT
        COALESCE(SUM(amount), 0) AS totalPayments

      FROM payments
      WHERE payment_status = 'paid'
        AND currency = 'EGP'
    `);

    res.json({
      ...applicationRows[0],
      totalPayments: Number(paymentRows[0].totalPayments),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Could not fetch overview statistics",
    });
  }
});

export default router;
