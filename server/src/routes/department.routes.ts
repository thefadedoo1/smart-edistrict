import { Router } from "express";
import { Role } from "@prisma/client";

import {
  create,
  getAll,
  update,
  remove,
  catalog,
} from "../controllers/department.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

// ==========================
// Public Routes
// ==========================

// Citizen Service Catalog
router.get("/catalog", catalog);

// All Departments (Admin/Master Data)
router.get("/", getAll);

// ==========================
// Admin Routes
// ==========================

router.post(
  "/",
  authenticate,
  authorize(Role.ADMIN),
  create
);

router.patch(
  "/:id",
  authenticate,
  authorize(Role.ADMIN),
  update
);

router.delete(
  "/:id",
  authenticate,
  authorize(Role.ADMIN),
  remove
);

export default router;