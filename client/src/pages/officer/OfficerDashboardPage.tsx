import OfficerGreeting from "../../components/officer/OfficerGreeting";
import DashboardSummary from "../../components/officer/DashboardSummary";
import PendingTable from "../../components/officer/PendingTable";

import { useOfficerDashboard } from "../../hooks/useWorkflow";

const OfficerDashboardPage = () => {
  const {
    data,
    isLoading,
    error,
  } = useOfficerDashboard();

  if (isLoading) {
    return (
      <div className="p-6">
        Loading dashboard...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 text-red-600">
        Failed to load dashboard.
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6">
      {/* Greeting */}
      <OfficerGreeting
  pending={data.summary.pending}
/>

      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Officer Dashboard
        </h1>

        <p className="mt-2 text-gray-500">
          Monitor pending applications, SLA performance,
          and process citizen requests efficiently.
        </p>
      </div>

      {/* Dashboard Statistics */}
      <DashboardSummary
        summary={data.summary}
      />

      {/* Pending Applications */}
      <div>
        <h2 className="mb-4 text-2xl font-semibold">
          Priority Queue
        </h2>

        <PendingTable
          applications={data.applications}
        />
      </div>
    </div>
  );
};

export default OfficerDashboardPage;