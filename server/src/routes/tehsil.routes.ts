import { Router } from "express";
import { Role } from "@prisma/client";

import {
  create,
  getAll,
  getByDistrict,
} from "../controllers/tehsil.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

// Public Routes
router.get("/", getAll);

router.get("/district/:districtId", getByDistrict);

// Admin Only
router.post(
  "/",
  authenticate,
  authorize(Role.ADMIN),
  create
);

export default router;