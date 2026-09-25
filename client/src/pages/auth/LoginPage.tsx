import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Shield, User, Award, ArrowRight, Landmark } from "lucide-react";
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
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      
      {/* Top Navigation / Logo area */}
      <div className="absolute top-0 left-0 w-full bg-white border-b border-slate-200 py-4 px-6 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3">
          <div className="bg-blue-800 p-2 rounded-lg text-white">
            <Landmark size={20} />
          </div>
          <span className="text-xl font-bold text-slate-900 leading-tight">Smart eDistrict</span>
        </Link>
        <Link to="/" className="text-sm font-semibold text-blue-700 hover:text-blue-800 transition-colors">
          Return to Home
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mt-12">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">
          Sign in to your account
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Secure access to official government services
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white border border-slate-200 py-8 px-6 shadow-sm rounded-xl sm:px-10">
          
          {/* Portal Selector Tabs */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200 mb-6">
            <button
              type="button"
              onClick={() => setPortal("CITIZEN")}
              className={`py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                portal === "CITIZEN"
                  ? "bg-white text-blue-700 shadow-sm border-slate-200 border"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              <User className="w-3.5 h-3.5" /> Citizen
            </button>
            <button
              type="button"
              onClick={() => setPortal("OFFICER")}
              className={`py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                portal === "OFFICER"
                  ? "bg-white text-blue-700 shadow-sm border-slate-200 border"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Award className="w-3.5 h-3.5" /> Officer
            </button>
            <button
              type="button"
              onClick={() => setPortal("ADMIN")}
              className={`py-2 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 ${
                portal === "ADMIN"
                  ? "bg-white text-blue-700 shadow-sm border-slate-200 border"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
              }`}
            >
              <Shield className="w-3.5 h-3.5" /> Admin
            </button>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {portal === "CITIZEN" ? "Email or Mobile Number" : "Official Email / Username"}
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={portal === "CITIZEN" ? "e.g. 98XXXXXXXX" : "e.g. officer@gov.in"}
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent text-sm shadow-sm"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <Link to="/forgot-password" className="text-xs font-semibold text-blue-700 hover:text-blue-800">
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent text-sm shadow-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 transition-colors shadow-sm disabled:opacity-70"
            >
              {loading ? "Authenticating..." : `Sign in to ${portal.charAt(0) + portal.slice(1).toLowerCase()} Portal`}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {portal === "CITIZEN" && (
            <div className="mt-6 pt-6 border-t border-slate-200 text-center">
              <p className="text-sm text-slate-600">
                Don't have an account?{" "}
                <Link to="/register" className="font-semibold text-blue-700 hover:text-blue-800">
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