import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Shield, ArrowRight, KeyRound } from "lucide-react";
import { forgotPassword, resetPassword } from "../../services/auth.service";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      await forgotPassword(email);
      setStep(2);
      toast.success("OTP sent to your email!");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
        "Failed to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      await resetPassword(email, otp, newPassword);
      toast.success("Password reset successfully! Please login.");
      navigate("/login");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
        "Failed to reset password. Please verify OTP and try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-xl shadow-emerald-900/30 mb-4">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-black tracking-tight text-white">
          {step === 1 ? "Forgot Password" : "Reset Password"}
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          {step === 1 
            ? "Enter your email to receive an OTP" 
            : `Enter the OTP sent to ${email} and your new password`}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 px-4">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
          {step === 2 ? (
            <form className="space-y-6" onSubmit={handleResetPassword}>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  One-Time Password (OTP)
                </label>
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm tracking-widest text-center font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !otp || !newPassword}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg shadow-emerald-900/40 disabled:opacity-50"
              >
                {loading ? "Resetting..." : "Reset Password"}
                {!loading && <KeyRound className="w-4 h-4" />}
              </button>

              <div className="text-center mt-4">
                <button 
                  type="button" 
                  onClick={() => setStep(1)} 
                  className="text-sm font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Back to Email Input
                </button>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleSendOtp}>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all shadow-lg shadow-emerald-900/40 disabled:opacity-50"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>

              <div className="text-center mt-4">
                <Link to="/login" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">
                  Return to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
