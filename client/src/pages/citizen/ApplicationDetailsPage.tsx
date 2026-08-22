import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Download,
  QrCode,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Send,
  Eye,
  Edit3,
} from "lucide-react";

import Card from "../../components/ui/Card";
import DocumentUploadList from "../../components/application/DocumentUploadList";
import ApplicationTimeline from "../../components/application/ApplicationTimeline";
import ApplicationCorrectionEditor from "../../components/application/ApplicationCorrectionEditor";
import {
  useApplication,
  useSubmitApplication,
} from "../../hooks/useApplicationForm";
import api from "../../services/api";

const ApplicationDetailsPage = () => {
  const { id = "" } = useParams();

  const [allDocumentsUploaded, setAllDocumentsUploaded] = useState(false);
  const [clarificationText, setClarificationText] = useState("");
  const [sendingClarification, setSendingClarification] = useState(false);

  const [showGrievanceForm, setShowGrievanceForm] = useState(false);
  const [grievanceText, setGrievanceText] = useState("");
  const [submittingGrievance, setSubmittingGrievance] = useState(false);

  const { data, isLoading, error, refetch } = useApplication(id);
  const submitMutation = useSubmitApplication();

  async function handleSubmit() {
    if (!allDocumentsUploaded) {
      toast.error("Please upload all mandatory documents first.");
      return;
    }

    try {
      await submitMutation.mutateAsync(id);
      toast.success("Application submitted successfully.");
      refetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Submission failed.");
    }
  }

  async function handleSendClarification(e: React.FormEvent) {
    e.preventDefault();
    if (!clarificationText.trim()) return;

    try {
      setSendingClarification(true);
      await api.post(`/clarifications/${id}`, {
        message: clarificationText,
      });
      toast.success("Clarification response sent to reviewing officer.");
      setClarificationText("");
      refetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to send response");
    } finally {
      setSendingClarification(false);
    }
  }

  async function handleRaiseGrievance(e: React.FormEvent) {
    e.preventDefault();
    if (!grievanceText.trim()) return;

    try {
      setSubmittingGrievance(true);
      await api.post(`/complaints`, {
        applicationId: id,
        message: grievanceText,
      });
      toast.success("Grievance submitted successfully. The Admin team will review it.");
      setGrievanceText("");
      setShowGrievanceForm(false);
      refetch();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to submit grievance");
    } finally {
      setSubmittingGrievance(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-500">Loading application details...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-4xl p-6 text-center">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-rose-700">
          <p className="font-semibold">Failed to load application details.</p>
          <Link to="/dashboard" className="mt-4 inline-block font-medium underline">
            Return to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const isApproved = data.status === "APPROVED";
  const isRejected = data.status === "REJECTED";
  const isCorrection = data.status === "CORRECTION_REQUIRED";

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      {/* ================= Header & Actions ================= */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-md bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-800">
              {data.certificateService.name}
            </span>
            {isCorrection && (
              <span className="flex items-center gap-1 rounded-md bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                <AlertTriangle className="h-3 w-3 text-amber-600" /> Correction Requested
              </span>
            )}
            {data.isEscalated && (
              <span className="flex items-center gap-1 rounded-md bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-700">
                <AlertTriangle className="h-3 w-3" /> SLA Escalated
              </span>
            )}
          </div>
          <h1 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
            Application #{data.applicationNumber || "Draft"}
          </h1>
          <p className="text-xs text-slate-500">
            Submitted on {new Date(data.createdAt).toLocaleDateString("en-IN", { dateStyle: "long" })}
          </p>
        </div>

        {/* Action Button for Certificate */}
        {isApproved && data.certificateNumber && (
          <div className="flex flex-wrap gap-2">
            <a
              href={`http://localhost:5000/api/certificates/view/${data.certificateNumber}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-slate-800"
            >
              <Eye className="h-4 w-4" /> View Certificate
            </a>
            <a
              href={`http://localhost:5000/api/certificates/download/${data.certificateNumber}.pdf`}
              target="_blank"
              rel="noreferrer"
              download
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/30 transition hover:bg-emerald-700"
            >
              <Download className="h-4 w-4" /> Download PDF
            </a>
            <Link
              to={`/verify/${data.certificateNumber}`}
              target="_blank"
              className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              <QrCode className="h-4 w-4" /> Verify QR
            </Link>
          </div>
        )}

        {/* Action Button for Delayed Services */}
        {data.isEscalated && !isApproved && !isRejected && !showGrievanceForm && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setShowGrievanceForm(true)}
              className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-rose-700"
            >
              <AlertTriangle className="h-4 w-4" /> Raise Grievance
            </button>
          </div>
        )}
      </div>

      {/* ================= Grievance Form ================= */}
      {showGrievanceForm && (
        <Card className="border-rose-200 bg-rose-50/50 p-6">
          <h3 className="text-lg font-bold text-rose-950">File a Grievance for Delayed Service</h3>
          <p className="text-xs text-rose-700 mb-4">Your application has breached the official SLA. You can raise a complaint to the District Magistrate / Admin.</p>
          <form onSubmit={handleRaiseGrievance} className="flex flex-col gap-3">
            <textarea 
              value={grievanceText}
              onChange={(e) => setGrievanceText(e.target.value)}
              className="w-full rounded-xl border border-rose-200 p-3 text-sm focus:border-rose-500 focus:outline-none"
              placeholder="Describe your issue..."
              rows={3}
              required
              minLength={10}
            />
            <div className="flex gap-2 justify-end">
              <button 
                type="button" 
                onClick={() => setShowGrievanceForm(false)}
                className="px-4 py-2 text-sm font-semibold text-rose-800 hover:bg-rose-100 rounded-xl transition"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={submittingGrievance}
                className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-rose-700 disabled:opacity-50"
              >
                {submittingGrievance ? "Submitting..." : "Submit Grievance"}
                <Send className="h-4 w-4" />
              </button>
            </div>
          </form>
        </Card>
      )}

      {/* ================= Certificate Banner if Approved ================= */}
      {isApproved && (
        <div className="relative overflow-hidden rounded-2xl border-2 border-emerald-500 bg-gradient-to-r from-emerald-900 to-teal-900 p-6 text-white shadow-xl">
          <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 text-emerald-300">
                <ShieldCheck className="h-6 w-6" />
                <span className="text-xs font-bold uppercase tracking-wider">Official Certificate Issued</span>
              </div>
              <h2 className="mt-1 text-2xl font-black text-white">
                Certificate #{data.certificateNumber}
              </h2>
              <p className="mt-1 text-sm text-emerald-100">
                Digitally approved and signed by the Tehsildar with tamper-proof QR code verification.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href={`http://localhost:5000/api/certificates/view/${data.certificateNumber}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-emerald-900 shadow-md transition hover:bg-emerald-50"
              >
                <Eye className="h-4 w-4" /> View PDF Online
              </a>
              <a
                href={`http://localhost:5000/api/certificates/download/${data.certificateNumber}.pdf`}
                target="_blank"
                rel="noreferrer"
                download
                className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-md transition hover:bg-emerald-600"
              >
                <Download className="h-4 w-4" /> Download PDF
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ================= AI Intelligence Card & SLA ================= */}
      {data.isSubmitted && !isApproved && !isRejected && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Live Stage Timer */}
          <Card className="border-l-4 border-l-blue-600 p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Current Processing Stage
                </p>
                <h3 className="mt-1 text-lg font-bold text-slate-800">
                  {data.currentStage === "DA" && "Dealing Assistant Verification"}
                  {data.currentStage === "PATWARI" && "Halqa Patwari Field Report"}
                  {data.currentStage === "DA_REVIEW" && "DA Final Scrutiny"}
                  {data.currentStage === "TEHSILDAR" && "Tehsildar Decision & Signature"}
                </h3>
              </div>
              <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
                <Clock className="h-5 w-5" />
              </div>
            </div>

            {data.sla && (
              <div className="mt-4 border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-500">Official SLA Timer:</span>
                  <span className={data.sla.isOverdue ? "font-bold text-rose-600" : "font-bold text-blue-600"}>
                    {data.sla.isOverdue
                      ? `⚠️ Overdue by ${data.sla.overdueHours} hours`
                      : `⏳ ${data.sla.remainingHours}h ${data.sla.remainingMinutes}m remaining`}
                  </span>
                </div>
                <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full ${data.sla.isOverdue ? "bg-rose-500" : "bg-blue-600"}`}
                    style={{ width: `${Math.min(100, data.sla.percentElapsed || 0)}%` }}
                  />
                </div>
              </div>
            )}
          </Card>

          {/* AI Completion Estimation */}
          <Card className="border-l-4 border-l-purple-600 p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-purple-600">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">AI Expected Resolution</span>
                </div>
                <h3 className="mt-1 text-lg font-bold text-slate-800">
                  {data.aiPrediction
                    ? `Within ${data.aiPrediction.predictedDaysRemaining} Days`
                    : "Standard SLA: 5-7 Days"}
                </h3>
              </div>
              <span className="rounded-full bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700">
                {data.aiPrediction?.riskLevel || "LOW"} RISK
              </span>
            </div>

            {data.aiPrediction && (
              <div className="mt-4 border-t border-slate-100 pt-3 text-xs text-slate-600">
                <p>
                  Estimated completion:{" "}
                  <span className="font-semibold text-slate-800">
                    {new Date(data.aiPrediction.estimatedCompletionDate).toLocaleDateString("en-IN", {
                      dateStyle: "medium",
                    })}
                  </span>
                </p>
                {data.aiPrediction.reasons?.length > 0 && (
                  <p className="mt-1 text-slate-500">• {data.aiPrediction.reasons[0]}</p>
                )}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* ================= Timeline Progress ================= */}
      <Card className="p-6">
        <h2 className="mb-6 text-lg font-bold text-slate-900">Application File Flow (Transparent Verification)</h2>
        <ApplicationTimeline
          currentStage={data.currentStage || "DA"}
          status={data.status}
        />
      </Card>

      {/* ================= CORRECTION REQUIRED: Full Interactive Editor ================= */}
      {isCorrection && (
        <ApplicationCorrectionEditor
          application={data}
          onUpdated={() => {
            refetch();
          }}
        />
      )}

      {/* ================= Form Data Preview (When Not in Correction Mode) ================= */}
      {!isCorrection && (
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Application Form Details</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Object.entries(data.formData || {}).map(([key, value]) => {
              if (key.endsWith("Id") || key === "id") return null;

              if (key === "familyMembers" && Array.isArray(value)) {
                return (
                  <div key={key} className="col-span-full rounded-2xl bg-purple-50/40 p-5 border border-purple-200">
                    <p className="text-xs font-bold uppercase tracking-wider text-purple-950 mb-3">
                      Family Members (As per Self-Declaration)
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {value.map((m: any, idx: number) => (
                        <div key={idx} className="bg-white p-3 rounded-xl border border-purple-100 shadow-xs text-xs">
                          <span className="font-bold text-slate-900 block text-sm">{m.name || m.fullName}</span>
                          <span className="text-purple-700 font-semibold mt-0.5 block">{m.relation || m.relationship}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              }
              return (
                <div key={key} className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {key.replace(/([A-Z])/g, " $1")}
                  </p>
                  <p className="mt-1 font-medium text-slate-800">{String(value)}</p>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* ================= Documents Section (When Not in Correction Mode) ================= */}
      {!isCorrection && (
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-bold text-slate-900">Uploaded Supporting Documents</h2>
          <DocumentUploadList
            applicationId={data.id}
            requiredDocuments={data.certificateService.requiredDocuments || []}
            isSubmitted={data.isSubmitted}
            onUploadStatusChange={setAllDocumentsUploaded}
          />
        </Card>
      )}

      {/* ================= Final Submit Action for Drafts ================= */}
      {!data.isSubmitted && (
        <Card className="border-emerald-200 bg-emerald-50/50 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-bold text-emerald-950">Final Application Submission</h3>
              <p className="text-xs text-slate-600">
                Once submitted, your application will enter the official verification pipeline (DA ➔ Patwari ➔ Tehsildar).
              </p>
            </div>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!allDocumentsUploaded || submitMutation.isPending}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 hover:bg-emerald-700 disabled:bg-slate-400"
            >
              {submitMutation.isPending ? "Submitting..." : "Submit Application"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default ApplicationDetailsPage;