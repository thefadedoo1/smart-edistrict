import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import { upload } from "../middleware/upload.middleware";
import { Role } from "@prisma/client";

import {
  upload as uploadController,
  list,
  viewFile,
  viewFileByName,
} from "../controllers/document.controller";

const router = Router();

// Stream/View document file by ID (Accessible by logged-in users / officers)
router.get("/file/:id", viewFile);

// Stream/View document file by direct file name
router.get("/raw/:fileName", viewFileByName);

// Upload document
router.post(
  "/:applicationId",
  authenticate,
  authorize(Role.CITIZEN),
  upload.single("document"),
  uploadController
);

// View uploaded documents list
router.get(
  "/:applicationId",
  authenticate,
  list
);

export default router;