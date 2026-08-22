import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Shield, User, Award, CheckCircle2, ArrowRight } from "lucide-react";
import { loginUser } from "../../services/auth.service";
import { useAuth } from "../../hooks/useAuth";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [portal, setPortal] = useState<"CITIZEN" | "OFFICER" | "ADMIN">("CITIZEN");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await loginUser({
        identifier,
        password,
        portal,
      });

      login(res.data.token, res.data.user);
      toast.success(`Welcome back, ${res.data.user.fullName}!`);

      if (res.data.user.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else if (["DA", "PATWARI", "TEHSILDAR"].includes(res.data.user.role)) {
        navigate("/officer/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
        "Login failed. Please verify your credentials and portal."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-xl shadow-emerald-900/30 mb-4">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-black tracking-tight text-white">
          HimSeva e-District
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Government of Himachal Pradesh • Single Window Citizen Portal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
          {/* Portal Selector Tabs */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-950/80 rounded-xl border border-slate-800/80 mb-6">
            <button
              type="button"
              onClick={() => setPortal("CITIZEN")}
              className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                portal === "CITIZEN"
                  ? "bg-emerald-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <User className="w-3.5 h-3.5" /> Citizen
            </button>
            <button
              type="button"
              onClick={() => setPortal("OFFICER")}
              className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                portal === "OFFICER"
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Award className="w-3.5 h-3.5" /> Officer
            </button>
            <button
              type="button"
              onClick={() => setPortal("ADMIN")}
              className={`py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                portal === "ADMIN"
                  ? "bg-amber-600 text-white shadow"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Shield className="w-3.5 h-3.5" /> Admin
            </button>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                {portal === "CITIZEN" ? "Email or Mobile No." : "Official Email / Username"}
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={portal === "CITIZEN" ? "applicant@hp.in or 98XXXXXXXX" : "officer@hp.gov.in"}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg shadow-emerald-900/40 disabled:opacity-50"
            >
              {loading ? "Authenticating..." : `Sign in to ${portal.charAt(0) + portal.slice(1).toLowerCase()} Portal`}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {portal === "CITIZEN" && (
            <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
              <p className="text-xs text-slate-400">
                Don't have a HimSeva account?{" "}
                <Link to="/register" className="font-semibold text-emerald-400 hover:text-emerald-300">
                  Register as Citizen
                </Link>
              </p>
            </div>
          )}


        </div>
      </div>
    </div>
  );
}