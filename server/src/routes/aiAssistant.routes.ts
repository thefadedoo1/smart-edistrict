import { Router } from "express";
import { askAssistant } from "../controllers/aiAssistant.controller";
import { optionalAuthenticate } from "../middleware/auth.middleware";

const router = Router();

router.post("/chat", optionalAuthenticate, askAssistant);

export default router;
