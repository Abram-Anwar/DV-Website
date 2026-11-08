import { Router } from "express";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { pool } from "../db.js";

const router = Router();

//? The fee is decided by the server, never by the browser
const SERVICE_FEE = 300;

const bodySchema = z.object({ applicationId: z.string().uuid() });

//? TEMPORARY: a fake payment for testing, replaced by a real gateway later
router.post("/test", async (req, res) => {
  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid data" });
  }
  const { applicationId } = parsed.data;

  try {
    const [apps] = await pool.query(
      "SELECT id FROM applications WHERE id = ?",
      [applicationId],
    );
    if (apps.length === 0) {
      return res.status(404).json({ message: "Application not found" });
    }

    //? Already paid? Do not record a second payment
    const [paid] = await pool.query(
      `SELECT id FROM payments
      WHERE application_id = ? AND payment_status = 'paid' LIMIT 1`,
      [applicationId],
    );
    if (paid.length > 0) {
      return res.status(409).json({ message: "Already paid" });
    }

    await pool.query(
      `INSERT INTO payments
        (id, application_id, amount, currency, payment_method,
          payment_status, transaction_id, paid_at)
      VALUES (?, ?, ?, 'EGP', 'test', 'paid', ?, NOW())`,
      [randomUUID(), applicationId, SERVICE_FEE, `TEST-${randomUUID()}`],
    );

    res.json({ paid: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not process the payment" });
  }
});

export default router;
