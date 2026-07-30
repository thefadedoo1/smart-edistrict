import { Router } from "express";
import { Role } from "@prisma/client";

import {
  create,
  getAll,
} from "../controllers/district.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

// Public Route
router.get("/", getAll);

// Admin Only
router.post(
  "/",
  authenticate,
  authorize(Role.ADMIN),
  create
);

export default router;