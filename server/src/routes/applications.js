import { Router } from "express";
import { randomUUID } from "node:crypto";
import { pool } from "../db.js";
import { createApplicationSchema } from "../validators/application.js";

//? The form and the API use English codes, the database stores Arabic labels
const MARITAL_STATUS_AR = {
  single: "أعزب",
  married: "متزوج",
  divorced: "مطلق",
  widowed: "أرمل",
};

const router = Router();

//? Builds a number like DV-27-4356
function generateApplicationNumber() {
  const year = (new Date().getFullYear() + 1).toString().slice(-2);
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `DV-${year}-${rand}`;
}

router.post("/", async (req, res) => {
  const parsed = createApplicationSchema.safeParse(req.body);
  if (!parsed.success) {
    return res
      .status(400)
      .json({ message: "Invalid data", errors: parsed.error.issues });
  }
  const { maritalStatus, hasChildren, applicant, spouse, children } =
    parsed.data;

  const applicationId = randomUUID();

  //? Declared outside the try so the catch and finally can see it
  let conn;
  try {
    //? Getting a connection can fail too (e.g. the database is down)
    conn = await pool.getConnection();

    //? Start: either everything is saved, or nothing
    await conn.beginTransaction();

    //? The number is random, so retry if it already exists (UNIQUE key)
    const MAX_ATTEMPTS = 5;
    let applicationNumber;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      applicationNumber = generateApplicationNumber();
      try {
        await conn.query(
          `INSERT INTO applications (id, application_number, marital_status, has_children)
          VALUES (?, ?, ?, ?)`,
          [
            applicationId,
            applicationNumber,
            MARITAL_STATUS_AR[maritalStatus],
            hasChildren,
          ],
        );
        break; // inserted successfully
      } catch (err) {
        //? Retry only for a duplicate number, and give up after the last attempt
        if (err.code !== "ER_DUP_ENTRY" || attempt === MAX_ATTEMPTS) throw err;
      }
    }

    await conn.query(
      `INSERT INTO applicants
        (id, application_id, full_name, email, phone, date_of_birth,
          place_of_birth, qualification, address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        randomUUID(),
        applicationId,
        applicant.fullName,
        applicant.email,
        applicant.phone,
        applicant.dateOfBirth,
        applicant.placeOfBirth,
        applicant.qualification,
        applicant.address,
      ],
    );

    //? Spouse: only exists when married (the validator guarantees it)
    if (spouse) {
      await conn.query(
        `INSERT INTO spouses
      (id, application_id, full_name, date_of_birth, place_of_birth, qualification, phone)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          randomUUID(),
          applicationId,
          spouse.fullName,
          spouse.dateOfBirth,
          spouse.placeOfBirth,
          spouse.qualification ?? null,
          spouse.phone ?? null,
        ],
      );
    }

    //? Children: one INSERT for all of them
    if (children.length > 0) {
      const rows = children.map((c) => [
        randomUUID(),
        applicationId,
        c.fullName,
        c.gender,
        c.dateOfBirth,
        c.placeOfBirth,
      ]);

      await conn.query(
        `INSERT INTO children
      (id, application_id, full_name, gender, date_of_birth, place_of_birth)
    VALUES ?`,
        [rows],
      );
    }

    await conn.commit();
    res.status(201).json({ applicationId, applicationNumber });
  } catch (err) {
    console.error(err);

    //? Undo everything, but only if we actually got a connection
    if (conn) await conn.rollback();

    res.status(500).json({ message: "Could not save the application" });
  } finally {
    //? Always give the connection back to the pool (if we got one)
    conn?.release();
  }
});

export default router;
