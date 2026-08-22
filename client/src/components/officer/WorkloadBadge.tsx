interface Props {
  pending: number;
}

const WorkloadBadge = ({
  pending,
}: Props) => {
  let label = "Low";
  let classes =
    "bg-green-100 text-green-700";

  if (pending >= 80) {
    label = "Critical";
    classes =
      "bg-red-100 text-red-700";
  } else if (pending >= 50) {
    label = "High";
    classes =
      "bg-orange-100 text-orange-700";
  } else if (pending >= 20) {
    label = "Medium";
    classes =
      "bg-yellow-100 text-yellow-700";
  }

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${classes}`}
    >
      {label} Workload
    </span>
  );
};

export default WorkloadBadge;