import { useState } from "react";
import { Link } from "react-router-dom";
import {
  BadgeCheck,
  Download,
  Eye,
  ShieldCheck,
  FileText,
  Calendar,
  Building2,
  ExternalLink,
  PlusCircle,
  X,
} from "lucide-react";

import Card from "../../components/ui/Card";
import { useCertificates } from "../../hooks/useCertificates";

export default function CertificatesPage() {
  const { data: certificates, isLoading, error } = useCertificates();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>("");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2.5 text-2xl font-black text-slate-900 sm:text-3xl">
            <BadgeCheck className="h-7 w-7 text-emerald-600" /> Issued Certificates
          </h1>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            Access, view, download, and verify your digitally signed government certificates.
          </p>
        </div>

        <Link
          to="/services"
          className="inline-flex items-center gap-2 self-start rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-emerald-700"
        >
          <PlusCircle className="h-4 w-4" /> Apply for New Certificate
        </Link>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-white p-8">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
            <p className="text-xs font-semibold text-slate-500">Loading your certificates...</p>
          </div>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center text-rose-700">
          <p className="font-bold">Failed to load certificates.</p>
        </div>
      ) : (certificates || []).length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <BadgeCheck className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-base font-bold text-slate-800">No Certificates Issued Yet</h3>
          <p className="mt-1 text-xs text-slate-500">
            Once your submitted applications are reviewed and approved by the Tehsildar, your official digitally signed certificates will appear here.
          </p>
          <div className="mt-5 flex justify-center gap-3">
            <Link
              to="/applications"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Check My Applications
            </Link>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
            >
              Apply for Certificate
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {certificates?.map((cert) => (
            <div
              key={cert.id}
              className="relative flex flex-col justify-between overflow-hidden rounded-2xl border-2 border-emerald-500/20 bg-gradient-to-br from-white via-emerald-50/20 to-teal-50/30 p-6 shadow-sm transition hover:border-emerald-500/50 hover:shadow-md"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-800">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-700" /> Tamper-Proof Verified
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-500">
                    {cert.applicationNumber}
                  </span>
                </div>

                <h3 className="mt-3 text-lg font-black text-slate-900">{cert.serviceName}</h3>
                <p className="mt-0.5 font-mono text-xs font-semibold text-emerald-800">
                  Ref: {cert.certificateNumber}
                </p>

                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    <span>Issued Date: <strong>{new Date(cert.issuedAt).toLocaleDateString("en-IN")}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-3.5 w-3.5 text-slate-400" />
                    <span>Authority: <strong>{cert.issuedBy}</strong></span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-emerald-100 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setPreviewUrl(`http://localhost:5000/api/certificates/view/${cert.certificateNumber}`);
                    setPreviewTitle(cert.serviceName);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-slate-800"
                >
                  <Eye className="h-3.5 w-3.5" /> Preview PDF
                </button>

                <a
                  href={`http://localhost:5000${cert.downloadUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-emerald-700"
                >
                  <Download className="h-3.5 w-3.5" /> Download
                </a>

                <Link
                  to={cert.verifyUrl}
                  target="_blank"
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> QR Verify
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* In-App PDF Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="flex h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{previewTitle}</h3>
                <p className="text-xs text-slate-500">Official Digitally Signed Certificate Preview</p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewUrl(null)}
                className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-200 hover:text-slate-900"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 bg-slate-100">
              <iframe
                src={previewUrl}
                title="Certificate Preview"
                className="h-full w-full border-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
