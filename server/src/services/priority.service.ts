import { Application, User, CitizenProfile } from "@prisma/client";

interface PriorityInput {
  application: Application & {
    applicant?: (User & { profile?: CitizenProfile | null }) | null;
  };
  remainingHours: number;
  isOverdue: boolean;
}

export interface PriorityBreakdown {
  score: number;
  tags: { label: string; points: number; type: "critical" | "warning" | "info" | "normal" }[];
}

export function calculatePriorityDetailed({
  application,
  remainingHours,
  isOverdue,
}: PriorityInput): PriorityBreakdown {
  let score = 20;
  const tags: PriorityBreakdown["tags"] = [];

  // 1. SLA Urgency
  if (isOverdue || application.isEscalated) {
    score += 80;
    tags.push({ label: "SLA Overdue / Escalated", points: 80, type: "critical" });
  } else if (remainingHours <= 6) {
    score += 60;
    tags.push({ label: "Critical (< 6h Remaining)", points: 60, type: "critical" });
  } else if (remainingHours <= 12) {
    score += 40;
    tags.push({ label: "Urgent (< 12h Remaining)", points: 40, type: "warning" });
  } else if (remainingHours <= 24) {
    score += 25;
    tags.push({ label: "Due Today", points: 25, type: "warning" });
  }

  // 2. Demographic & Profile Factors
  const profile = application.applicant?.profile;
  if (profile?.dateOfBirth) {
    const age = Math.floor(
      (Date.now() - new Date(profile.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365.25)
    );
    if (age >= 60) {
      score += 40;
      tags.push({ label: `Senior Citizen (${age} yrs)`, points: 40, type: "info" });
    }
  }

  // 3. Form Data Analysis
  const formData = (application.formData as Record<string, any>) || {};
  const formStr = JSON.stringify(formData).toLowerCase();

  if (formStr.includes("disability") || formStr.includes("handicap") || formStr.includes("divyang")) {
    score += 30;
    tags.push({ label: "Specially-Abled / Divyang", points: 30, type: "info" });
  }

  if (
    formStr.includes("bpl") ||
    (formData.annualIncome && Number(formData.annualIncome) <= 100000)
  ) {
    score += 25;
    tags.push({ label: "BPL / Low Income", points: 25, type: "info" });
  }

  if (
    formStr.includes("scholarship") ||
    formStr.includes("admission") ||
    formStr.includes("exam") ||
    formStr.includes("recruitment")
  ) {
    score += 20;
    tags.push({ label: "Scholarship / Education", points: 20, type: "info" });
  }

  return {
    score: Math.min(100, Math.max(0, score)),
    tags,
  };
}

export function calculatePriority(input: PriorityInput): number {
  return calculatePriorityDetailed(input).score;
}