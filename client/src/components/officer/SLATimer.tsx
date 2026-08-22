interface Props {
  deadline: string | Date | null;
}

const SLATimer = ({
  deadline,
}: Props) => {
  if (!deadline) {
    return (
      <span className="text-gray-500">
        No Deadline
      </span>
    );
  }

  const deadlineDate =
    new Date(deadline);

  const now = new Date();

  const diff =
    deadlineDate.getTime() -
    now.getTime();

  if (diff <= 0) {
    const overdueHours =
      Math.abs(diff) /
      (1000 * 60 * 60);

    const overdueDays =
      Math.floor(overdueHours / 24);

    if (overdueDays >= 1) {
      return (
        <span className="font-semibold text-red-600">
          🔴 Overdue by{" "}
          {overdueDays} day
          {overdueDays > 1 ? "s" : ""}
        </span>
      );
    }

    return (
      <span className="font-semibold text-red-600">
        🔴 Overdue
      </span>
    );
  }

  const remainingHours =
    Math.floor(
      diff / (1000 * 60 * 60)
    );

  if (remainingHours <= 24) {
    return (
      <span className="font-semibold text-orange-600">
        🟠 {remainingHours} hour
        {remainingHours !== 1 ? "s" : ""} left
      </span>
    );
  }

  const remainingDays =
    Math.floor(
      remainingHours / 24
    );

  return (
    <span className="font-semibold text-green-600">
      🟢 {remainingDays} day
      {remainingDays !== 1 ? "s" : ""} left
    </span>
  );
};

export default SLATimer;