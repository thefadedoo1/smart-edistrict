import { Router } from "express";
import { getOverallReport, getDistrictReport, getTehsilReport, getOfficerReport } from "../controllers/adminReport.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/overall", getOverallReport);
router.get("/district", getDistrictReport);
router.get("/tehsil", getTehsilReport);
router.get("/officer", getOfficerReport);

export default router;
