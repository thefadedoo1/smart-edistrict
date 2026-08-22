import { Router } from "express";
import { Role } from "@prisma/client";

import {
  create,
  get,
  update,
} from "../controllers/citizenProfile.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.use(
  authenticate,
  authorize(Role.CITIZEN)
);

router.post("/", create);

router.get("/", get);

router.patch("/", update);

export default router;