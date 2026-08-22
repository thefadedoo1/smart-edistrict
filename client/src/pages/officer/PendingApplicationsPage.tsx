import { usePendingApplications } from "../../hooks/useWorkflow";
import PendingTable from "../../components/officer/PendingTable";

const PendingApplicationsPage = () => {
  const { data: applications, isLoading, error } = usePendingApplications();

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Pending Applications
        </h1>
        <p className="mt-2 text-slate-500">
          Applications assigned to you that require your review and action.
        </p>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-slate-200 rounded w-1/4 mx-auto"></div>
            <div className="h-64 bg-slate-100 rounded w-full"></div>
          </div>
          <p className="mt-4 text-slate-500 font-medium">Loading applications...</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-600 shadow-sm">
          <p className="font-semibold">Failed to load pending applications.</p>
          <p className="text-sm mt-1 text-red-500">Please try refreshing the page.</p>
        </div>
      ) : (
        <PendingTable applications={applications || []} />
      )}
    </div>
  );
};

export default PendingApplicationsPage;