import { Router } from "express";
import { Role } from "@prisma/client";

import {
  create,
  getMy,
  getById,
  submit,
  update,
  resubmit,
} from "../controllers/application.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

// Citizen routes
router.post(
  "/",
  authenticate,
  authorize(Role.CITIZEN),
  create
);

router.get(
  "/my",
  authenticate,
  authorize(Role.CITIZEN),
  getMy
);

router.patch(
  "/:id",
  authenticate,
  authorize(Role.CITIZEN),
  update
);

router.patch(
  "/:id/submit",
  authenticate,
  authorize(Role.CITIZEN),
  submit
);

router.post(
  "/:id/resubmit",
  authenticate,
  authorize(Role.CITIZEN),
  resubmit
);

// Any authenticated user can view an application.
router.get(
  "/:id",
  authenticate,
  getById
);

export default router;