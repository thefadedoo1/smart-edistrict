import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FolderOpen,
  Search,
  Filter,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  FileText,
  PlusCircle,
  Calendar,
  Sparkles,
} from "lucide-react";

import Card from "../../components/ui/Card";
import { useMyApplications } from "../../hooks/useMyApplications";

export default function MyApplicationsPage() {
  const { data: applications, isLoading, error } = useMyApplications();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const getStatusBadge = (status: string, stage?: string | null) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-800">
            <CheckCircle2 className="h-3.5 w-3.5" /> Approved
          </span>
        );
      case "IN_PROGRESS":
      case "SUBMITTED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-800">
            <Clock className="h-3.5 w-3.5" /> Under Verification ({stage || "DA"})
          </span>
        );
      case "CORRECTION_REQUIRED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">
            <AlertCircle className="h-3.5 w-3.5" /> Action Required
          </span>
        );
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-3 py-1 text-xs font-bold text-rose-800">
            <XCircle className="h-3.5 w-3.5" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            Draft
          </span>
        );
    }
  };

  const filteredApps = (applications || []).filter((app) => {
    const matchesSearch =
      (app.applicationNumber?.toLowerCase() || "").includes(search.toLowerCase()) ||
      (app.certificateService?.name?.toLowerCase() || "").includes(search.toLowerCase());

    if (statusFilter === "ALL") return matchesSearch;
    if (statusFilter === "PENDING") {
      return (
        matchesSearch &&
        (app.status === "IN_PROGRESS" || app.status === "SUBMITTED")
      );
    }
    if (statusFilter === "APPROVED") {
      return matchesSearch && app.status === "APPROVED";
    }
    if (statusFilter === "CORRECTION") {
      return matchesSearch && app.status === "CORRECTION_REQUIRED";
    }
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-black text-slate-900 sm:text-3xl">
            <FolderOpen className="h-7 w-7 text-blue-600" /> My Applications
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Track real-time departmental progress, SLA status, and certificate issuance.
          </p>
        </div>

        <Link
          to="/services"
          className="inline-flex items-center gap-2 self-start rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-blue-700"
        >
          <PlusCircle className="h-4 w-4" /> Apply for New Certificate
        </Link>
      </div>

      {/* Filters & Search */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Application No (e.g. HP-2026-...) or Service Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-xs placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: "All", value: "ALL" },
              { label: "In Verification", value: "PENDING" },
              { label: "Approved", value: "APPROVED" },
              { label: "Action Required", value: "CORRECTION" },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                  statusFilter === tab.value
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Applications List */}
      {isLoading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-white p-8">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
            <p className="text-xs font-semibold text-slate-500">Loading your applications...</p>
          </div>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-700">
          <AlertCircle className="mx-auto h-8 w-8 text-rose-500" />
          <p className="mt-2 font-bold">Failed to load applications.</p>
        </div>
      ) : filteredApps.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <FileText className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-800">No applications found</h3>
          <p className="mt-1 text-xs text-slate-500">
            {search || statusFilter !== "ALL"
              ? "No applications matched your search filters."
              : "You haven't submitted any certificate applications yet."}
          </p>
          <Link
            to="/services"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
          >
            <PlusCircle className="h-4 w-4" /> Apply for a Service Now
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredApps.map((app) => (
            <Card
              key={app.id}
              className="p-5 transition hover:border-blue-300 hover:shadow-md"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-700">
                      {app.applicationNumber || "Draft (Not Submitted)"}
                    </span>
                    {getStatusBadge(app.status, app.currentStage)}
                    {app.isEscalated && (
                      <span className="rounded-md bg-rose-100 px-2 py-0.5 text-[10px] font-black text-rose-700">
                        SLA Escalated
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900">
                    {app.certificateService?.name}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      Applied: {new Date(app.createdAt).toLocaleDateString("en-IN")}
                    </span>

                    {(app as any).prediction?.predictedDaysRemaining && (
                      <span className="flex items-center gap-1 font-semibold text-emerald-700">
                        <Sparkles className="h-3.5 w-3.5" />
                        Est. Completion: {(app as any).prediction.predictedDaysRemaining} Days
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {app.status === "APPROVED" && (
                    <Link
                      to={`/applications/${app.id}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3.5 py-2 text-xs font-bold text-emerald-700 hover:bg-emerald-100"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Download Certificate
                    </Link>
                  )}

                  <Link
                    to={`/applications/${app.id}`}
                    className="inline-flex items-center gap-1 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
                  >
                    View Status <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
