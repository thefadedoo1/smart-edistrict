import {
  CheckCircle2,
  Clock3,
  XCircle,
  Loader2,
} from "lucide-react";

interface StatusBadgeProps {
  status: string;
}

const styles = {
  APPROVED: {
    icon: CheckCircle2,
    className:
      "bg-green-100 text-green-700",
    text: "Approved",
  },

  PENDING: {
    icon: Clock3,
    className:
      "bg-yellow-100 text-yellow-700",
    text: "Pending",
  },

  REJECTED: {
    icon: XCircle,
    className:
      "bg-red-100 text-red-700",
    text: "Rejected",
  },

  IN_PROGRESS: {
    icon: Loader2,
    className:
      "bg-blue-100 text-blue-700",
    text: "In Progress",
  },
} as const;

const StatusBadge = ({
  status,
}: StatusBadgeProps) => {

  const config =
    styles[status as keyof typeof styles] ??
    styles.PENDING;

  const Icon = config.icon;

  return (
    <span
      className={`
        inline-flex
        items-center
        gap-2
        px-3
        py-1
        rounded-full
        text-sm
        font-medium
        ${config.className}
      `}
    >
      <Icon size={16} />

      {config.text}
    </span>
  );
};

export default StatusBadge;