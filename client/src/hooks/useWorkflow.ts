import {
  useMutation,
  useQuery,
} from "@tanstack/react-query";

import {
  getOfficerDashboard,
  getPendingApplications,
  getWorkflowHistory,
  getOfficerHistoryList,
  workflowAction,
  getApplicationForReview,
} from "../services/workflow.service";

export function useOfficerDashboard() {
  return useQuery({
    queryKey: ["officer-dashboard"],
    queryFn: getOfficerDashboard,
  });
}

export function usePendingApplications() {
  return useQuery({
    queryKey: ["pending-applications"],
    queryFn: getPendingApplications,
  });
}
export function useApplicationReview(
  applicationId: string
) {
  return useQuery({
    queryKey: [
      "application-review",
      applicationId,
    ],
    queryFn: () =>
      getApplicationForReview(
        applicationId
      ),
    enabled: !!applicationId,
  });
}
export function useWorkflowHistory(
  applicationId: string
) {
  return useQuery({
    queryKey: [
      "workflow-history",
      applicationId,
    ],
    queryFn: () =>
      getWorkflowHistory(
        applicationId
      ),
    enabled: !!applicationId,
  });
}

export function useOfficerHistoryList() {
  return useQuery({
    queryKey: ["officer-history-list"],
    queryFn: getOfficerHistoryList,
  });
}

export function useWorkflowAction() {
  return useMutation({
    mutationFn: ({
      applicationId,
      action,
      remarks,
    }: {
      applicationId: string;
      action: string;
      remarks?: string;
    }) =>
      workflowAction(
        applicationId,
        action,
        remarks
      ),
  });
}