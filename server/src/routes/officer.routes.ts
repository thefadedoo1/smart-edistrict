import { Router } from "express";
import { Role } from "@prisma/client";

import {
  create,
  getAll,
  getById,
  update,
  remove,
} from "../controllers/officer.controller";

import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

// All officer routes require ADMIN access
router.use(authenticate, authorize(Role.ADMIN));

router.get("/", getAll);

router.get("/:id", getById);

router.post("/", create);

router.patch("/:id", update);

router.delete("/:id", remove);

export default router;