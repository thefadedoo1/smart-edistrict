import { Router } from "express";
import { Role } from "@prisma/client";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import {
  generate,
  download,
  verify,
  getMy,
  viewInline,
} from "../controllers/certificate.controller";

const router = Router();

// Public QR Code Verification Endpoint (No auth required)
router.get("/verify/:certificateNumber", verify);

// View Certificate Inline (Browser preview)
router.get("/view/:certificateNumber", viewInline);

// Download Certificate (Attachment download)
router.get("/download/:fileName", download);

// Get all certificates issued to logged in citizen
router.get("/my", authenticate, authorize(Role.CITIZEN), getMy);

// Tehsildar Generate Certificate
router.post(
  "/:applicationId/generate",
  authenticate,
  authorize(Role.TEHSILDAR),
  generate
);

export default router;