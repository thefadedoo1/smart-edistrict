import { Router } from "express";
import { Role } from "@prisma/client";

import {
  create,
  getAll,
  getByCode,
  update,
  remove,
} from "../controllers/certificateService.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

// Public
router.get("/", getAll);
router.get("/:code", getByCode);

// Admin
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