import multer from "multer";
import path from "path";
import { UPLOADS_DIR } from "../config/paths";

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, UPLOADS_DIR);
  },

  filename(req, file, cb) {
    const cleanExt = path.extname(file.originalname).toLowerCase();
    const uniqueName = `doc_${Date.now()}_${Math.round(Math.random() * 1e9)}${cleanExt}`;
    cb(null, uniqueName);
  },
});

function fileFilter(
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) {
  const allowed = [
    "application/pdf",
    "image/jpeg",
    "image/jpg",
    "image/png",
  ];

  if (allowed.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error("Only PDF, JPG and PNG files are allowed."));
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});