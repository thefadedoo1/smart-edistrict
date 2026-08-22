import path from "path";
import fs from "fs";

export const ROOT_DIR = process.cwd();
export const UPLOADS_DIR = path.resolve(ROOT_DIR, "uploads");
export const CERTIFICATES_DIR = path.resolve(ROOT_DIR, "certificates");

// Ensure directories exist
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

if (!fs.existsSync(CERTIFICATES_DIR)) {
  fs.mkdirSync(CERTIFICATES_DIR, { recursive: true });
}
