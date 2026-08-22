import { Link } from "react-router-dom";
import { ArrowRight, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { useOfficerHistoryList } from "../../hooks/useWorkflow";
import Card from "../../components/ui/Card";

const OfficerHistoryListPage = () => {
  const { data: applications, isLoading, error } = useOfficerHistoryList();

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Processed Applications
        </h1>
        <p className="mt-2 text-slate-500">
          History of all applications you have interacted with or processed.
        </p>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-slate-200 rounded w-1/4 mx-auto"></div>
            <div className="h-64 bg-slate-100 rounded w-full"></div>
          </div>
          <p className="mt-4 text-slate-500 font-medium">Loading history...</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-600 shadow-sm">
          <p className="font-semibold">Failed to load processed applications.</p>
          <p className="text-sm mt-1 text-red-500">Please try refreshing the page.</p>
        </div>
      ) : !applications || applications.length === 0 ? (
        <Card className="p-8 text-center">
          <Clock className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-lg font-bold text-slate-900">No History Found</h3>
          <p className="mt-2 text-sm text-slate-500">You haven't processed any applications yet.</p>
        </Card>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Application
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Citizen
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Service
                </th>
                <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                  Current Status
                </th>
                <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {applications.map((app: any) => (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{app.applicationNumber}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      Updated: {new Date(app.updatedAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700 font-medium">
                    {app.applicant?.fullName || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {app.certificateService?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    {app.status === "APPROVED" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
                        <CheckCircle2 size={14} /> Approved
                      </span>
                    ) : app.status === "CORRECTION_REQUIRED" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-800">
                        <AlertCircle size={14} /> Needs Correction
                      </span>
                    ) : app.status === "REJECTED" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-1 text-xs font-bold text-red-800">
                        <AlertCircle size={14} /> Rejected
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-800">
                        <Clock size={14} /> {app.currentStage}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link
                      to={`/officer/history/${app.id}`}
                      className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      View Logs <ArrowRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OfficerHistoryListPage;
