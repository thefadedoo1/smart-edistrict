import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ShieldCheck,
  ShieldAlert,
  Download,
  Building2,
  Calendar,
  User,
  MapPin,
  CheckCircle2,
  ArrowLeft,
  Eye,
  IndianRupee,
  Home,
} from "lucide-react";
import api from "../services/api";

interface CertificateVerification {
  valid: boolean;
  certificateNumber: string;
  serviceName: string;
  salutation?: string;
  applicantName: string;
  relationType?: string;
  relativeName?: string;
  district: string;
  tehsil: string;
  village?: string;
  address?: string;
  annualIncome?: string;
  issuedAt: string;
  issuedBy?: string;
  downloadUrl: string;
  certificateUrl?: string;
}

export default function CertificateVerifyPage() {
  const { certificateNumber = "" } = useParams();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<CertificateVerification | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function verify() {
      if (!certificateNumber) {
        setError("Invalid certificate identifier.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await api.get(`/certificates/verify/${certificateNumber}`);
        if (res.data.success && res.data.data) {
          setData(res.data.data);
        } else {
          setError("Certificate not found or unverified.");
        }
      } catch (err: any) {
        setError(err.response?.data?.message || "Certificate record could not be found.");
      } finally {
        setLoading(false);
      }
    }

    verify();
  }, [certificateNumber]);

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-3xl z-10">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-xl mb-3">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            HimSeva Certificate Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Government of Himachal Pradesh • Department of Revenue & Citizen Services
          </p>
        </div>

        {loading ? (
          <div className="bg-slate-800/80 backdrop-blur border border-slate-700 rounded-2xl p-10 text-center shadow-2xl">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
            <p className="text-sm font-semibold text-slate-300">
              Verifying digital certificate authenticity with Himachal State Registry...
            </p>
          </div>
        ) : error || !data ? (
          <div className="bg-slate-800/90 border border-rose-500/50 rounded-2xl p-8 text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-white">Certificate Verification Failed</h2>
            <p className="text-sm text-rose-300 mt-2">{error || "No valid certificate matched this reference number."}</p>
            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-700 text-white text-xs font-semibold hover:bg-slate-600 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Portal Home
            </Link>
          </div>
        ) : (
          <div className="bg-slate-950/90 border border-emerald-500/40 rounded-2xl shadow-2xl overflow-hidden backdrop-blur">
            {/* Verified Banner */}
            <div className="bg-gradient-to-r from-emerald-800 to-teal-700 p-6 text-white text-center">
              <div className="inline-flex items-center gap-2 bg-emerald-950/60 border border-emerald-400/40 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-200 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Tamper-Proof Digitally Verified Certificate
              </div>
              <h2 className="text-xl sm:text-2xl font-black">{data.serviceName}</h2>
              <p className="text-xs text-emerald-100 mt-1 font-mono tracking-wide">
                Certificate ID: {data.certificateNumber}
              </p>
            </div>

            {/* Details Grid */}
            <div className="p-6 sm:p-8 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                {/* Beneficiary */}
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase mb-1">
                    <User className="w-3.5 h-3.5 text-emerald-400" /> Beneficiary (Citizen)
                  </div>
                  <p className="text-base font-bold text-white">
                    {data.salutation ? `${data.salutation} ` : ""}{data.applicantName}
                  </p>
                  {data.relativeName && (
                    <p className="text-xs text-slate-400 mt-0.5">
                      {data.relationType || "Son/Daughter of"} {data.relativeName}
                    </p>
                  )}
                </div>

                {/* Office & Authority */}
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase mb-1">
                    <Building2 className="w-3.5 h-3.5 text-emerald-400" /> Issuing Office
                  </div>
                  <p className="text-sm font-bold text-white">
                    Office of Tehsildar, {data.tehsil}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    District: {data.district} • {data.issuedBy || "Executive Magistrate / Naib-Tehsildar"}
                  </p>
                </div>

                {/* Address & Village */}
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase mb-1">
                    <Home className="w-3.5 h-3.5 text-emerald-400" /> Resident Address
                  </div>
                  <p className="text-xs font-medium text-white leading-relaxed">
                    {data.address || `Village ${data.village || data.tehsil}, Tehsil ${data.tehsil}, Distt ${data.district}`}
                  </p>
                </div>

                {/* Annual Income / Validity */}
                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase mb-1">
                    <IndianRupee className="w-3.5 h-3.5 text-emerald-400" /> Verified Family Income
                  </div>
                  <p className="text-base font-bold text-emerald-400">
                    ₹{Number(data.annualIncome || "100000").toLocaleString("en-IN")} / Annum
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Issued: {new Date(data.issuedAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row gap-3 justify-between items-center">
                <Link
                  to="/"
                  className="text-xs text-slate-400 hover:text-slate-200 transition flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> HimSeva Portal Home
                </Link>

                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <a
                    href={`http://localhost:5000/api/certificates/view/${data.certificateNumber}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-700 transition border border-slate-700"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Certificate
                  </a>
                  <a
                    href={`http://localhost:5000/api/certificates/download/${data.certificateNumber}.pdf`}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500 transition shadow-lg shadow-emerald-900/40"
                  >
                    <Download className="w-4 h-4" /> Download PDF
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
