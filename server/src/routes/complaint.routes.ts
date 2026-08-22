import { Router } from "express";
import { createComplaint, getAllComplaints, updateComplaintStatus } from "../controllers/complaint.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

// Citizen routes
router.post("/", authenticate, authorize("CITIZEN"), createComplaint);

// Admin routes
router.get("/", authenticate, authorize("ADMIN"), getAllComplaints);
router.put("/:id", authenticate, authorize("ADMIN"), updateComplaintStatus);

export default router;
