import { Router } from "express";
import { Role } from "@prisma/client";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import {
  pending,
  history,
  officerHistory,
  process,
  dashboard,
} from "../controllers/workflow.controller";

const router = Router();

router.get(
  "/dashboard",
  authenticate,
  authorize(Role.DA, Role.PATWARI, Role.TEHSILDAR),
  dashboard
);

router.get(
  "/pending",
  authenticate,
  authorize(Role.DA, Role.PATWARI, Role.TEHSILDAR),
  pending
);

router.get(
  "/officer-history",
  authenticate,
  authorize(Role.DA, Role.PATWARI, Role.TEHSILDAR),
  officerHistory
);

router.get("/:applicationId/history", authenticate, history);

router.post(
  "/:applicationId/action",
  authenticate,
  authorize(Role.DA, Role.PATWARI, Role.TEHSILDAR),
  process
);

export default router;