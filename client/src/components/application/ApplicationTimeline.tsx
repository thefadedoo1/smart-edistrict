interface Props {
  currentStage: string;
  status: string;
}

const stages = [
  { key: "SUBMITTED", label: "Application Submitted" },
  { key: "DA", label: "Received by DA" },
  { key: "PATWARI", label: "Verified by Patwari" },
  { key: "DA_REVIEW", label: "DA Review" },
  { key: "TEHSILDAR", label: "Tehsildar Approval" },
  { key: "COMPLETED", label: "Certificate Generated" },
];

const stageIndex: Record<string, number> = {
  SUBMITTED: 0,
  DA: 1,
  PATWARI: 2,
  DA_REVIEW: 3,
  TEHSILDAR: 4,
  COMPLETED: 5,
};

const ApplicationTimeline = ({ currentStage, status }: Props) => {
  // When fully approved, all 6 stages are complete (green)
  const isFullyApproved = status === "APPROVED";
  // When rejected, mark up to current stage as done but with red for current
  const isRejected = status === "REJECTED";
  // Current active index
  const active = stageIndex[currentStage] ?? 0;

  return (
    <div className="space-y-4">
      {stages.map((stage, index) => {
        let circle = "bg-gray-300";
        let textClass = "text-gray-400";

        if (isFullyApproved) {
          // All stages green when certificate is approved
          circle = "bg-green-500";
          textClass = "font-semibold text-slate-800";
        } else if (isRejected) {
          if (index < active) {
            circle = "bg-green-500";
            textClass = "font-medium text-slate-700";
          } else if (index === active) {
            circle = "bg-red-500";
            textClass = "font-semibold text-red-700";
          }
        } else {
          if (index < active) {
            circle = "bg-green-500";
            textClass = "font-medium text-slate-700";
          } else if (index === active) {
            circle = "bg-yellow-500";
            textClass = "font-semibold text-slate-800";
          }
        }

        return (
          <div key={stage.key} className="flex items-center gap-4">
            <div className={`h-4 w-4 rounded-full flex-shrink-0 ${circle}`} />
            <span className={textClass}>{stage.label}</span>
          </div>
        );
      })}

      {status === "CORRECTION_REQUIRED" && (
        <div className="mt-4 rounded bg-yellow-100 p-3 text-yellow-800 text-sm font-medium">
          ⚠️ Correction requested by officer. Please review and resubmit.
        </div>
      )}

      {status === "REJECTED" && (
        <div className="mt-4 rounded bg-red-100 p-3 text-red-700 text-sm font-medium">
          ❌ Application Rejected.
        </div>
      )}

      {status === "APPROVED" && (
        <div className="mt-4 rounded bg-green-100 p-3 text-green-700 text-sm font-semibold">
          ✅ Certificate Approved.
        </div>
      )}
    </div>
  );
};

export default ApplicationTimeline;