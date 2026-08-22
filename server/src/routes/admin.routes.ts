import { Router } from "express";
import { Role } from "@prisma/client";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import {
  getAnalytics,
  getLeaderboard,
  getWorkloadRecommendations,
  reassign,
  triggerEscalationCheck,
} from "../controllers/admin.controller";

const router = Router();

router.use(authenticate);
router.use(authorize(Role.ADMIN));

router.get("/analytics", getAnalytics);
router.get("/leaderboard", getLeaderboard);
router.get("/workload-recommendations", getWorkloadRecommendations);
router.post("/reassign", reassign);
router.post("/escalations/check", triggerEscalationCheck);

export default router;
