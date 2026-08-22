import { Link } from "react-router-dom";
import {
  FolderOpen,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  BadgeCheck,
} from "lucide-react";

import WelcomeBanner from "../../components/dashboard/WelcomeBanner";
import StatsGrid from "../../components/dashboard/StatsGrid";
import QuickServices from "../../components/dashboard/QuickServices";
import Card from "../../components/ui/Card";
import { useMyApplications } from "../../hooks/useMyApplications";

const DashboardPage = () => {
  const { data: applications, isLoading } = useMyApplications();

  const recentApps = (applications || []).slice(0, 4);

  return (
    <div className="space-y-8">
      <WelcomeBanner profileCompletion={100} />

      <StatsGrid />

      <QuickServices />

      {/* Recent Applications Card */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-black text-slate-900">
            <FolderOpen className="h-5 w-5 text-blue-600" /> Recent Application Submissions
          </h2>
          <Link
            to="/applications"
            className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            View All ({applications?.length || 0}) <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {isLoading ? (
          <Card className="p-6 text-center text-xs text-slate-500">
            Loading recent applications...
          </Card>
        ) : recentApps.length === 0 ? (
          <Card className="p-8 text-center">
            <FileText className="mx-auto h-8 w-8 text-slate-400" />
            <p className="mt-2 text-xs font-semibold text-slate-600">No applications submitted yet.</p>
            <Link
              to="/services"
              className="mt-3 inline-block rounded-xl bg-blue-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-blue-700"
            >
              Apply for Certificate
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {recentApps.map((app) => (
              <Card
                key={app.id}
                className="flex flex-col justify-between p-4 transition hover:border-blue-300"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-600">
                      {app.applicationNumber || "Draft"}
                    </span>
                    {app.status === "APPROVED" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                        <CheckCircle2 className="h-3 w-3" /> Approved
                      </span>
                    ) : app.status === "CORRECTION_REQUIRED" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-800">
                        <AlertCircle className="h-3 w-3" /> Action Needed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-[11px] font-bold text-blue-800">
                        <Clock className="h-3 w-3" /> In Verification
                      </span>
                    )}
                  </div>

                  <h3 className="mt-2 text-sm font-bold text-slate-900">
                    {app.certificateService?.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    Submitted: {new Date(app.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                  {app.status === "APPROVED" ? (
                    <Link
                      to="/certificates"
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 hover:underline"
                    >
                      <BadgeCheck className="h-3.5 w-3.5" /> Certificate Ready
                    </Link>
                  ) : (
                    <span className="text-[11px] text-slate-400">
                      Stage: {app.currentStage || "DA Review"}
                    </span>
                  )}

                  <Link
                    to={`/applications/${app.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-900 hover:text-blue-600"
                  >
                    Details <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;