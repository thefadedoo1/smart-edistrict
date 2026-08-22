import { useContext, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  AlertCircle,
  Clock,
  FileText,
  User,
  Users,
  ShieldAlert,
  Eye,
  X,
  ExternalLink,
} from "lucide-react";

import Card from "../../components/ui/Card";
import { AuthContext } from "../../context/AuthContext";
import {
  useApplicationReview,
  useWorkflowAction,
} from "../../hooks/useWorkflow";

const ApplicationReviewPage = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [remarks, setRemarks] = useState("");
  const [docPreviewUrl, setDocPreviewUrl] = useState<string | null>(null);
  const [docPreviewTitle, setDocPreviewTitle] = useState<string>("");
  const workflowMutation = useWorkflowAction();

  const {
    data: application,
    isLoading,
    error,
    refetch,
  } = useApplicationReview(id);

  async function handleAction(
    action: "FORWARD" | "APPROVE" | "REJECT" | "CORRECTION_REQUIRED"
  ) {
    if (!application) return;

    if ((action === "REJECT" || action === "CORRECTION_REQUIRED") && !remarks.trim()) {
      toast.error("Please enter official remarks/reason for this action.");
      return;
    }

    try {
      await workflowMutation.mutateAsync({
        applicationId: application.id,
        action,
        remarks,
      });

      if (action === "APPROVE") {
        toast.success("Application approved! Official digital certificate generated.");
      } else if (action === "FORWARD") {
        toast.success("Application forwarded to next official stage.");
      } else if (action === "CORRECTION_REQUIRED") {
        toast.success("Application sent back to applicant for correction.");
      } else {
        toast.success("Application rejected.");
      }

      setRemarks("");
      await refetch();
      navigate("/officer/dashboard");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Action failed.");
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-500">Loading application file...</p>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="mx-auto max-w-4xl p-6 text-center">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-rose-700">
          <p className="font-semibold">Failed to load application file.</p>
          <Link to="/officer/dashboard" className="mt-4 inline-block font-medium underline">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const role = user?.role;
  const isTehsildar = role === "TEHSILDAR";
  const isPatwari = role === "PATWARI";
  const isDA = role === "DA";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      {/* ================= Top Banner / Header ================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
              {application.certificateService?.name}
            </span>
            {application.isEscalated && (
              <span className="flex items-center gap-1 rounded-md bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-700">
                <ShieldAlert className="h-3 w-3" /> SLA Escalated
              </span>
            )}
            <span className="rounded-md bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
              Stage: {application.currentStage}
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
            Review Application #{application.applicationNumber}
          </h1>
          <p className="text-xs text-slate-500">
            Priority Score: <span className="font-bold text-slate-800">{application.priorityScore || 50}/100</span>
          </p>
        </div>

        <Link
          to="/officer/dashboard"
          className="self-start rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          Back to In-Tray
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left 2 Columns: Details & Documents */}
        <div className="space-y-6 lg:col-span-2">
          {/* Applicant Profile */}
          <Card className="p-5">
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-700">
              <User className="h-4 w-4 text-blue-600" /> Applicant Information
            </h2>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
              <div>
                <p className="text-xs text-slate-500">Full Name</p>
                <p className="font-semibold text-slate-800">{application.applicant?.fullName || "Citizen"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Email Address</p>
                <p className="font-medium text-slate-800">{application.applicant?.email || "—"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Mobile Number</p>
                <p className="font-medium text-slate-800">{application.applicant?.phone || "—"}</p>
              </div>
            </div>
          </Card>

          {/* Form Fields Submitted */}
          <Card className="p-5">
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-700">
              <FileText className="h-4 w-4 text-blue-600" /> Submitted Application Form Details
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {Object.entries(application.formData || {}).map(([key, val]) => {
                // Ignore raw database IDs
                if (key.endsWith("Id") || key === "id") return null;

                // Dedicated Family Members Table View for Officers
                if (key === "familyMembers" && Array.isArray(val)) {
                  return (
                    <div
                      key={key}
                      className="col-span-full rounded-2xl border border-purple-200 bg-purple-50/40 p-4"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Users className="h-4 w-4 text-purple-700" />
                        <h3 className="text-xs font-bold uppercase tracking-wider text-purple-950">
                          Family Member Details (As per Verified Affidavit)
                        </h3>
                      </div>
                      <div className="overflow-x-auto rounded-xl border border-purple-100 bg-white shadow-xs">
                        <table className="min-w-full divide-y divide-purple-100 text-xs">
                          <thead className="bg-purple-50">
                            <tr>
                              <th className="px-3.5 py-2.5 text-left font-bold text-purple-950">#</th>
                              <th className="px-3.5 py-2.5 text-left font-bold text-purple-950">Member Full Name</th>
                              <th className="px-3.5 py-2.5 text-left font-bold text-purple-950">Relationship to Applicant</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-purple-50">
                            {val.map((m: any, idx: number) => (
                              <tr key={idx} className="hover:bg-purple-50/30">
                                <td className="px-3.5 py-2 font-medium text-slate-400">{idx + 1}</td>
                                <td className="px-3.5 py-2 font-bold text-slate-900">{m.name || m.fullName}</td>
                                <td className="px-3.5 py-2 font-medium text-purple-800">{m.relation || m.relationship}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={key} className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                    <p className="text-[11px] font-semibold uppercase text-slate-500">
                      {key.replace(/([A-Z])/g, " $1")}
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-slate-900">{String(val)}</p>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Uploaded Supporting Documents */}
          <Card className="p-5">
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-700">
              <FileText className="h-4 w-4 text-emerald-600" /> Attached Verification Documents
            </h2>
            <div className="mt-4 space-y-3">
              {(application.documents || []).length === 0 ? (
                <p className="text-xs text-slate-400">No documents attached.</p>
              ) : (
                application.documents.map((doc: any) => {
                  const viewUrl = `http://localhost:5000/api/documents/file/${doc.id}`;
                  return (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {doc.requiredDocument?.name || "Supporting Document"}
                        </p>
                        <p className="text-xs text-slate-500">{doc.originalFileName}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setDocPreviewUrl(viewUrl);
                            setDocPreviewTitle(doc.requiredDocument?.name || doc.originalFileName);
                          }}
                          className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 hover:bg-blue-100"
                        >
                          <Eye className="h-3.5 w-3.5" /> Preview
                        </button>
                        <a
                          href={viewUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                        >
                          <ExternalLink className="h-3.5 w-3.5" /> New Tab
                        </a>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>

          {/* Workflow Audit Trail */}
          <Card className="p-5">
            <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-700">
              <Clock className="h-4 w-4 text-purple-600" /> Workflow & Verification Audit Trail
            </h2>
            <div className="mt-4 space-y-3">
              {((application as any).history || (application as any).workflowLogs || []).map((log: any) => (
                <div key={log.id} className="rounded-xl border-l-4 border-l-blue-500 bg-slate-50 p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase text-blue-900">{log.action}</span>
                    <span className="text-[11px] text-slate-500">
                      {new Date(log.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-700">
                    <span className="font-semibold">{log.officer?.fullName}</span> ({log.officer?.role})
                  </p>
                  {log.remarks && (
                    <p className="mt-1 text-xs italic text-slate-600">"{log.remarks}"</p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right 1 Column: Decision Desk */}
        <div className="space-y-6">
          <Card className="sticky top-6 border-2 border-blue-500/20 p-5 shadow-lg">
            <h2 className="text-base font-black text-slate-900">Official Decision Panel</h2>
            <p className="mt-1 text-xs text-slate-500">
              Logged in as <span className="font-bold text-blue-700">{user?.fullName}</span> ({role})
            </p>

            <div className="mt-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Official Verification Remarks
              </label>
              <textarea
                rows={4}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter field inspection findings, document scrutiny notes, or deficiency details..."
                className="mt-2 w-full rounded-xl border border-slate-200 p-3 text-xs placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Action Buttons based on Role */}
            <div className="mt-5 space-y-2.5">
              {/* DA Actions */}
              {isDA && (
                <>
                  <button
                    type="button"
                    disabled={workflowMutation.isPending}
                    onClick={() => handleAction("FORWARD")}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-xs font-bold text-white shadow-md transition hover:bg-blue-700 disabled:opacity-50"
                  >
                    <ArrowRight className="h-4 w-4" />
                    {application.currentStage === "DA_REVIEW"
                      ? "Forward to Tehsildar (Final)"
                      : "Forward to Patwari (Field Check)"}
                  </button>
                  <button
                    type="button"
                    disabled={workflowMutation.isPending}
                    onClick={() => handleAction("CORRECTION_REQUIRED")}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-300 bg-amber-50 py-2.5 text-xs font-bold text-amber-800 transition hover:bg-amber-100 disabled:opacity-50"
                  >
                    <AlertCircle className="h-4 w-4" /> Request Citizen Correction
                  </button>
                </>
              )}

              {/* Patwari Actions */}
              {isPatwari && (
                <>
                  <button
                    type="button"
                    disabled={workflowMutation.isPending}
                    onClick={() => handleAction("FORWARD")}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-bold text-white shadow-md transition hover:bg-emerald-700 disabled:opacity-50"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Submit Report & Return to DA
                  </button>
                </>
              )}

              {/* Tehsildar Actions */}
              {isTehsildar && (
                <>
                  <button
                    type="button"
                    disabled={workflowMutation.isPending}
                    onClick={() => handleAction("APPROVE")}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 text-xs font-black text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-700 disabled:opacity-50"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Approve & Issue Certificate
                  </button>

                  <button
                    type="button"
                    disabled={workflowMutation.isPending}
                    onClick={() => handleAction("CORRECTION_REQUIRED")}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-300 bg-amber-50 py-2.5 text-xs font-bold text-amber-800 transition hover:bg-amber-100 disabled:opacity-50"
                  >
                    <AlertCircle className="h-4 w-4" /> Request Correction
                  </button>

                  <button
                    type="button"
                    disabled={workflowMutation.isPending}
                    onClick={() => handleAction("REJECT")}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-rose-300 bg-rose-50 py-2.5 text-xs font-bold text-rose-700 transition hover:bg-rose-100 disabled:opacity-50"
                  >
                    <XCircle className="h-4 w-4" /> Reject Application
                  </button>
                </>
              )}
            </div>
          </Card>
        </div>
      </div>

      {/* In-Desk Document Preview Modal */}
      {docPreviewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="flex h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{docPreviewTitle}</h3>
                <p className="text-xs text-slate-500">Applicant Supporting Document Verification</p>
              </div>
              <button
                type="button"
                onClick={() => setDocPreviewUrl(null)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200 hover:text-slate-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 bg-slate-100">
              <iframe
                src={docPreviewUrl}
                title="Document Preview"
                className="h-full w-full border-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplicationReviewPage;