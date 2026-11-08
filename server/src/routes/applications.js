import { Router } from "express";
import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { pool } from "../db.js";
import { upload } from "../middlewares/upload.js";
import { createApplicationSchema } from "../validators/application.js";

//? The form and the API use English codes, the database stores Arabic labels
const MARITAL_STATUS_AR = {
  single: "أعزب",
  married: "متزوج",
  divorced: "مطلق",
  widowed: "أرمل",
};

const router = Router();

//? The three kinds of image fields the form can send
const uploadFields = upload.fields([
  { name: "applicantImage", maxCount: 1 },
  { name: "spouseImage", maxCount: 1 },
  { name: "childImages", maxCount: 10 },
]);

//? Runs multer and turns its errors (e.g. file too large) into a 400 response
function handleUpload(req, res, next) {
  uploadFields(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
}

//? Deletes the uploaded files when the request fails (avoids orphan files)
async function removeFiles(files) {
  const all = Object.values(files).flat();
  await Promise.all(all.map((f) => fs.unlink(f.path).catch(() => {})));
}

//? Renames an uploaded file and keeps multer's file object up to date,
//? so removeFiles() still finds it if the request fails later
async function renameFile(file, baseName) {
  const finalName = `${baseName}${path.extname(file.filename)}`;
  const newPath = path.join(path.dirname(file.path), finalName);

  await fs.rename(file.path, newPath);

  file.filename = finalName;
  file.path = newPath;
}

//? Builds a number like DV-27-4356
function generateApplicationNumber() {
  const year = (new Date().getFullYear() + 1).toString().slice(-2);
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `DV-${year}-${rand}`;
}

router.post("/", handleUpload, async (req, res) => {
  const files = req.files || {};

  //? The JSON arrives as a string inside the "data" field
  let body;
  try {
    body = JSON.parse(req.body.data);
  } catch {
    await removeFiles(files);
    return res.status(400).json({ message: "Invalid data" });
  }

  const parsed = createApplicationSchema.safeParse(body);
  if (!parsed.success) {
    await removeFiles(files);
    return res
      .status(400)
      .json({ message: "Invalid data", errors: parsed.error.issues });
  }
  const { maritalStatus, hasChildren, applicant, spouse, children } =
    parsed.data;

  //? The uploaded images must match the data that was sent
  const applicantImage = files.applicantImage?.[0];
  const spouseImage = files.spouseImage?.[0];
  const childImages = files.childImages || [];

  const imagesMatch =
    applicantImage &&
    (spouse ? spouseImage : !spouseImage) &&
    childImages.length === children.length;

  if (!imagesMatch) {
    await removeFiles(files);
    return res
      .status(400)
      .json({ message: "Images do not match the application data" });
  }

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

    //? Name the images after the application number (it is unique)
    await renameFile(applicantImage, `${applicationNumber}_applicant`);
    if (spouseImage) {
      await renameFile(spouseImage, `${applicationNumber}_spouse`);
    }
    for (const [i, image] of childImages.entries()) {
      await renameFile(image, `${applicationNumber}_child${i + 1}`);
    }

    //? Only the file name is stored, the files live in the uploads folder
    await conn.query(
      `INSERT INTO applicants
        (id, application_id, full_name, email, phone, date_of_birth,
          place_of_birth, qualification, address, image_path)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        applicantImage.filename,
      ],
    );

    //? Spouse: only exists when married (the validator guarantees it)
    if (spouse) {
      await conn.query(
        `INSERT INTO spouses
          (id, application_id, full_name, date_of_birth, place_of_birth,
            qualification, phone, image_path)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          randomUUID(),
          applicationId,
          spouse.fullName,
          spouse.dateOfBirth,
          spouse.placeOfBirth,
          spouse.qualification,
          spouse.phone,
          spouseImage.filename,
        ],
      );
    }

    //? Children: one INSERT for all of them (image i belongs to child i)
    if (children.length > 0) {
      const rows = children.map((c, i) => [
        randomUUID(),
        applicationId,
        c.fullName,
        c.gender,
        c.dateOfBirth,
        c.placeOfBirth,
        childImages[i].filename,
      ]);

      await conn.query(
        `INSERT INTO children
          (id, application_id, full_name, gender, date_of_birth,
            place_of_birth, image_path)
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

    //? Nothing was saved, so the uploaded files are not needed
    await removeFiles(files);

    res.status(500).json({ message: "Could not save the application" });
  } finally {
    //? Always give the connection back to the pool (if we got one)
    conn?.release();
  }
});

export default router;