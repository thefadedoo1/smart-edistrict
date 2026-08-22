import express from "express";
import cors from "cors";

import { UPLOADS_DIR, CERTIFICATES_DIR } from "./config/paths";

import authRoutes from "./routes/auth.routes";
import districtRoutes from "./routes/district.routes";
import tehsilRoutes from "./routes/tehsil.routes";
import villageRoutes from "./routes/village.routes";
import certificateServiceRoutes from "./routes/certificateService.routes";
import departmentRoutes from "./routes/department.routes";
import officerRoutes from "./routes/officer.routes";
import citizenProfileRoutes from "./routes/citizenProfile.routes";
import applicationRoutes from "./routes/application.routes";
import workflowRoutes from "./routes/workflow.routes";
import documentRoutes from "./routes/document.routes";
import certificateRoutes from "./routes/certificate.routes";
import adminRoutes from "./routes/admin.routes";
import clarificationRoutes from "./routes/clarification.routes";
import aiAssistantRoutes from "./routes/aiAssistant.routes";
import complaintRoutes from "./routes/complaint.routes";
import adminReportRoutes from "./routes/adminReport.routes";

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/districts", districtRoutes);
app.use("/api/tehsils", tehsilRoutes);
app.use("/api/villages", villageRoutes);
app.use("/api/officers", officerRoutes);
app.use("/api/profile", citizenProfileRoutes);
app.use("/api/workflow", workflowRoutes);
app.use("/api/certificate-services", certificateServiceRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/admin/reports", adminReportRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/clarifications", clarificationRoutes);
app.use("/api/assistant", aiAssistantRoutes);
app.use("/api/complaints", complaintRoutes);

// Static file servers with permissive headers for iframe and new-tab rendering
app.use(
  "/uploads",
  express.static(UPLOADS_DIR, {
    setHeaders: (res) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      res.setHeader("Access-Control-Allow-Origin", "*");
    },
  })
);

app.use(
  "/certificates",
  express.static(CERTIFICATES_DIR, {
    setHeaders: (res) => {
      res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
      res.setHeader("Access-Control-Allow-Origin", "*");
    },
  })
);

app.get("/", (req, res) => {
  res.json({
    status: "online",
    system: "Smart e-District Himachal Pradesh (HimSeva)",
    version: "2.0.0",
    timestamp: new Date().toISOString(),
  });
});

export default app;