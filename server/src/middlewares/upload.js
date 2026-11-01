import multer from "multer";
import { randomUUID } from "node:crypto";

//? Allowed image types and the extension we choose for each
const ALLOWED_TYPES = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
};

//? Save files in /uploads with a random name
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    //? The extension comes from the file type, not from the user's file name
    cb(null, `${randomUUID()}${ALLOWED_TYPES[file.mimetype]}`);
  },
});

//? Accept only jpg / png images
const fileFilter = (req, file, cb) => {
  if (ALLOWED_TYPES[file.mimetype]) {
    cb(null, true);
  } else {
    //? Passing an error makes the route answer 400 with this message
    cb(new Error("Only JPG and PNG images are allowed"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB per image
});