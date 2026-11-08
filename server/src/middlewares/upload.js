import multer from "multer";
import { randomUUID } from "node:crypto";

//? Save files in /uploads with a random name
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    //? The extension comes from the file type, not from the user's file name
    cb(null, `${randomUUID()}.jpg`);
  },
});

//? Accept only jpg images
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    //? Passing an error makes the route answer 400 with this message
    cb(new Error("Only JPG images are allowed"));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB per image
});