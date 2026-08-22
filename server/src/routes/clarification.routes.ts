import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import {
  getClarifications,
  createQuery,
  replyQuery,
} from "../controllers/clarification.controller";

const router = Router();

router.use(authenticate);

router.get("/:applicationId", getClarifications);
router.post("/:applicationId", createQuery);
router.post("/query/:queryId/reply", replyQuery);

export default router;
