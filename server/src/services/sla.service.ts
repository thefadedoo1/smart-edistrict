import { WorkflowStage } from "@prisma/client";

export const STAGE_SLA_HOURS: Record<WorkflowStage, number> = {
  DA: 24,          // 1 Day
  PATWARI: 72,     // 3 Days
  DA_REVIEW: 24,   // 1 Day
  TEHSILDAR: 48,   // 2 Days
  COMPLETED: 0,
};

export const STAGE_SLA_DAYS: Record<WorkflowStage, number> = {
  DA: 1,
  PATWARI: 3,
  DA_REVIEW: 1,
  TEHSILDAR: 2,
  COMPLETED: 0,
};

export function calculateStageDeadline(stage: WorkflowStage): Date | null {
  if (stage === WorkflowStage.COMPLETED) {
    return null;
  }

  const hours = STAGE_SLA_HOURS[stage] || 24;
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}

export function getRemainingHours(deadline: Date | null): number {
  if (!deadline) return 0;
  return Math.floor((deadline.getTime() - Date.now()) / (1000 * 60 * 60));
}

export function isOverdue(deadline: Date | null): boolean {
  if (!deadline) return false;
  return deadline.getTime() < Date.now();
}

export function isDueToday(deadline: Date | null): boolean {
  if (!deadline) return false;
  const hours = getRemainingHours(deadline);
  return hours >= 0 && hours <= 24;
}

export interface StageSLAInfo {
  totalHours: number;
  elapsedHours: number;
  remainingHours: number;
  remainingMinutes: number;
  isOverdue: boolean;
  overdueHours: number;
  urgencyStatus: "ON_TRACK" | "WARNING_12H" | "CRITICAL_6H" | "OVERDUE";
  progressPercentage: number;
}

export function getStageSLAInfo(deadline: Date | null, stageStartedAt?: Date | null): StageSLAInfo {
  if (!deadline) {
    return {
      totalHours: 0,
      elapsedHours: 0,
      remainingHours: 0,
      remainingMinutes: 0,
      isOverdue: false,
      overdueHours: 0,
      urgencyStatus: "ON_TRACK",
      progressPercentage: 100,
    };
  }

  const now = Date.now();
  const deadlineTime = new Date(deadline).getTime();
  const startTime = stageStartedAt ? new Date(stageStartedAt).getTime() : deadlineTime - 24 * 60 * 60 * 1000;
  const totalDuration = Math.max(1, deadlineTime - startTime);
  const elapsed = Math.max(0, now - startTime);

  const diffMs = deadlineTime - now;
  const isOverdueFlag = diffMs < 0;
  const remainingHours = Math.floor(diffMs / (1000 * 60 * 60));
  const remainingMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const overdueHours = isOverdueFlag ? Math.abs(Math.floor(diffMs / (1000 * 60 * 60))) : 0;

  let urgencyStatus: "ON_TRACK" | "WARNING_12H" | "CRITICAL_6H" | "OVERDUE" = "ON_TRACK";
  if (isOverdueFlag) {
    urgencyStatus = "OVERDUE";
  } else if (remainingHours <= 6) {
    urgencyStatus = "CRITICAL_6H";
  } else if (remainingHours <= 12) {
    urgencyStatus = "WARNING_12H";
  }

  const progressPercentage = Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)));

  return {
    totalHours: Math.round(totalDuration / (1000 * 60 * 60)),
    elapsedHours: Math.round(elapsed / (1000 * 60 * 60)),
    remainingHours: isOverdueFlag ? 0 : remainingHours,
    remainingMinutes: isOverdueFlag ? 0 : remainingMinutes,
    isOverdue: isOverdueFlag,
    overdueHours,
    urgencyStatus,
    progressPercentage,
  };
}