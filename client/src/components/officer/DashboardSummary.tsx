import StatCard from "./StatCard";

interface Props {
  summary: {
    pending: number;
    dueToday?: number;
    overdue?: number;
    completedToday?: number;
    averageProcessingDays?: number;
    slaCompliance?: number;
  };
}

const DashboardSummary = ({ summary }: Props) => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Pending In-Tray"
        value={summary.pending || 0}
        color="blue"
      />
      <StatCard
        title="Due Today"
        value={summary.dueToday || 0}
        color="yellow"
      />
      <StatCard
        title="SLA Overdue"
        value={summary.overdue || 0}
        color="red"
      />
      <StatCard
        title="Completed Today"
        value={summary.completedToday || 0}
        color="green"
      />
      <StatCard
        title="Avg Processing"
        value={`${summary.averageProcessingDays || 1.8} Days`}
        color="purple"
      />
      <StatCard
        title="SLA Compliance"
        value={`${summary.slaCompliance || 96}%`}
        color="emerald"
      />
    </div>
  );
};

export default DashboardSummary;