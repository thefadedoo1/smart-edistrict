import { Router } from "express";
import { Role } from "@prisma/client";

import {
  create,
  getAll,
  getByTehsil,
} from "../controllers/village.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

// Public Routes
router.get("/", getAll);

router.get("/tehsil/:tehsilId", getByTehsil);

// Admin Only
router.post(
  "/",
  authenticate,
  authorize(Role.ADMIN),
  create
);

export default router;