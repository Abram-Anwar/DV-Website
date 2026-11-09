import { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import rateLimit from "express-rate-limit";
import { z } from "zod";
import { pool } from "../db.js";
import { requireAdmin, COOKIE_NAME } from "../middlewares/requireAdmin.js";
import { PAY_STATUS_SQL } from "../services/paymentStatus.js";

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

    //? The "ready to submit" queue: paid applications the owner has not submitted yet
    const [recentApplicationsRows] = await pool.query(`
  SELECT
    a.id,
    a.application_number AS applicationNumber,
    ap.full_name         AS applicantName,
    a.marital_status     AS maritalStatus,

    (
      SELECT COUNT(*)
      FROM children c
      WHERE c.application_id = a.id
    ) AS childrenCount,

    a.created_at AS createdAt

  FROM applications a

  JOIN applicants ap
    ON ap.application_id = a.id

  WHERE a.application_status = 'not_submitted'
    AND EXISTS (
      SELECT 1
      FROM payments p
      WHERE p.application_id = a.id
        AND p.payment_status = 'paid'
    )

  ORDER BY a.created_at DESC
  LIMIT 5
`);

    res.json({
      ...applicationRows[0],
      totalPayments: Number(paymentRows[0].totalPayments),
      recentApplications: recentApplicationsRows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Could not fetch overview statistics",
    });
  }
});

//? Query string rules: only "page" is accepted from the browser
const applicationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  submission: z.enum(["all", "submitted", "not_submitted"]).default("all"),
  payment: z
    .enum(["all", "not_started", "pending", "paid", "failed_cancelled"])
    .default("all"),
  search: z.string().trim().max(100).default(""),
});

//? Fixed on the server: the browser can never ask for thousands of rows at once
const PAGE_SIZE = 20;

//? Applications list (for now: no filters, newest first, 20 per page)
router.get(`/applications`, requireAdmin, async (req, res) => {
  const parsed = applicationQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid data" });
  }
  const { page, submission, payment, search } = parsed.data;

  const offset = (page - 1) * PAGE_SIZE;
  
  const escaped = search.replace(/[\\%_]/g, "\\$&");

  //? The WHERE is built from pieces: a piece is added only if the user chose that filter.
  //? "conditions" holds the SQL text, "params" holds the values for its "?" marks.
  const conditions = [];
  const params = [];

  if (submission !== "all") {
    conditions.push("a.application_status = ?");
    params.push(submission);
  }

  if (payment === "failed_cancelled") {
    //? Only the applications whose payment failed or was cancelled
    conditions.push(`${PAY_STATUS_SQL} IN ('failed', 'cancelled')`);
  } else if (payment !== "all") {
    //? paid, pending or not_started: one exact status, the value goes in params
    conditions.push(`${PAY_STATUS_SQL} = ?`);
    params.push(payment);
  }
  
  if (search !== "") {
    conditions.push("(ap.full_name LIKE ? OR a.application_number LIKE ?)");
    params.push(`%${escaped}%`, `%${escaped}%`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  //? Used by BOTH queries, so "total" always counts the same rows the list shows
  const fromAndWhere = `
    FROM applications a
    JOIN applicants ap ON ap.application_id = a.id
    ${where}
  `;

  try {
    //? Query 1: the rows of the requested page
    const [rows] = await pool.query(
      `SELECT
          a.id,
          a.application_number AS applicationNumber,
          ap.full_name         AS applicantName,
          a.marital_status     AS maritalStatus,
          (
          SELECT COUNT(*)
            FROM children c
            WHERE c.application_id = a.id
          ) AS childrenCount,
          ${PAY_STATUS_SQL}    AS paymentStatus,
          a.application_status AS applicationStatus,
          a.created_at         AS createdAt
          ${fromAndWhere}
        ORDER BY a.created_at DESC, a.id DESC
        LIMIT ? OFFSET ?`,
      [...params, PAGE_SIZE, offset],
    );

    // Query 2: how many applications exist in total (all pages)
    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total ${fromAndWhere}`,
      params,
    );

    res.json({ rows, total: Number(total), page, pageSize: PAGE_SIZE });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Could not fetch applications data",
    });
  }
});

export default router;
