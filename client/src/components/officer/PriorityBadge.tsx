interface Props {
  priority: number;
  isEscalated?: boolean;
}

const PriorityBadge = ({
  priority,
  isEscalated = false,
}: Props) => {
  if (isEscalated) {
    return (
      <span className="inline-flex items-center rounded-full bg-red-600 px-3 py-1 text-sm font-bold text-white">
        🚨 Escalated
      </span>
    );
  }

  let label = "Low";
  let classes =
    "bg-green-100 text-green-700";

  if (priority >= 90) {
    label = "Critical";
    classes =
      "bg-red-100 text-red-700";
  } else if (priority >= 70) {
    label = "High";
    classes =
      "bg-orange-100 text-orange-700";
  } else if (priority >= 40) {
    label = "Medium";
    classes =
      "bg-yellow-100 text-yellow-700";
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${classes}`}
    >
      {label} ({priority})
    </span>
  );
};

export default PriorityBadge;