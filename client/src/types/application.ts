export interface CertificateService {
  id: string;
  name: string;
  code?: string;
  description?: string;
  processingDays?: number;
  requiredDocuments?: {
    id: string;
    name: string;
    isMandatory: boolean;
    displayOrder?: number;
  }[];
  form?: {
    fields: {
      id: string;
      label: string;
      fieldKey: string;
      fieldType: string;
      placeholder?: string;
      defaultValue?: string;
      isRequired: boolean;
      options?: string[];
    }[];
  };
}

export interface UploadedDocument {
  id: string;
  originalFileName: string;
  fileName?: string;
  fileUrl?: string;
  mimeType?: string;
  fileSize?: number;
  requiredDocumentId?: string;
  requiredDocument?: {
    id: string;
    name: string;
  };
}

export interface WorkflowLog {
  id: string;
  stage: string;
  action: string;
  remarks: string | null;
  createdAt: string;
  officer: {
    id: string;
    fullName: string;
    role: string;
  };
}

export interface Application {
  id: string;
  applicationNumber: string | null;
  status: "DRAFT" | "SUBMITTED" | "IN_PROGRESS" | "APPROVED" | "REJECTED" | "CORRECTION_REQUIRED";
  currentStage: "DA" | "PATWARI" | "DA_REVIEW" | "TEHSILDAR" | null;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string | null;
  remarks: string | null;
  isSubmitted: boolean;
  isEscalated?: boolean;
  escalatedAt?: string | null;
  escalationReason?: string | null;
  priorityScore?: number;
  stageStartedAt?: string | null;
  stageDeadline?: string | null;

  certificateNumber?: string | null;
  certificateUrl?: string | null;
  issuedAt?: string | null;

  formData?: Record<string, any>;
  applicantId?: string;
  applicant?: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
  };

  certificateService: CertificateService;
  documents: UploadedDocument[];
  workflowLogs?: WorkflowLog[];

  assignedDA?: { id: string; fullName: string; role: string } | null;
  assignedPatwari?: { id: string; fullName: string; role: string } | null;
  assignedTehsildar?: { id: string; fullName: string; role: string } | null;

  sla?: {
    deadline: string;
    isOverdue: boolean;
    remainingHours: number;
    remainingMinutes: number;
    overdueHours: number;
    percentElapsed: number;
  };

  aiPrediction?: {
    predictedDaysRemaining: number;
    estimatedCompletionDate: string;
    confidenceScore: number;
    riskLevel: "LOW" | "MEDIUM" | "HIGH";
    reasons: string[];
  };
}