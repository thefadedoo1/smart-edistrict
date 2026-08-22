import api from "./api";

/* ================= Dashboard ================= */

export interface DashboardSummary {
  pending: number;
  dueToday: number;
  overdue: number;
  averageProcessingDays: number;
  slaCompliance: number;
}

export interface DashboardApplication {
  id: string;
  applicationNumber: string;

  currentStage: string;
  status: string;

  stageDeadline: string | null;

  remainingHours: number;
  isOverdue: boolean;

  priority: number;

  applicant: {
    fullName: string;
  };

  certificateService: {
    name: string;
  };
}

export interface WorkflowHistory {
  id: string;

  action: string;

  remarks: string | null;

  createdAt: string;

  officer: {
    fullName: string;
    role: string;
  };
}

export interface OfficerDashboard {
  summary: DashboardSummary;
  applications: DashboardApplication[];
}

interface DashboardResponse {
  success: boolean;
  data: OfficerDashboard;
}

export async function getOfficerDashboard() {
  const response =
    await api.get<DashboardResponse>(
      "/workflow/dashboard"
    );

  return response.data.data;
}

/* ================= Pending ================= */

export async function getPendingApplications() {
  const response = await api.get(
    "/workflow/pending"
  );

  return response.data.data;
}

/* ================= History ================= */

export async function getOfficerHistoryList() {
  const response = await api.get("/workflow/officer-history");
  return response.data.data;
}

export async function getWorkflowHistory(
  applicationId: string
) {
  const response = await api.get(
    `/workflow/${applicationId}/history`
  );

  return response.data.data;
}

/* ================= Workflow Action ================= */

export async function workflowAction(
  applicationId: string,
  action: string,
  remarks?: string
) {
  const response = await api.post(
    `/workflow/${applicationId}/action`,
    {
      action,
      remarks,
    }
  );

  return response.data.data;
}

export async function getApplicationForReview(
  applicationId: string
) {
  const response = await api.get(
    `/applications/${applicationId}`
  );

  return response.data.data;
}