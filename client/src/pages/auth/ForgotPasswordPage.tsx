import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowRight, KeyRound, Landmark } from "lucide-react";
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
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">
          {step === 1 ? "Forgot Password" : "Reset Password"}
        </h2>
        <p className="text-sm text-slate-600">
          {step === 1 
            ? "Enter your email to receive an OTP" 
            : `Enter the OTP sent to ${email} and your new password`}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white border border-slate-200 py-8 px-6 shadow-sm rounded-xl sm:px-10">
          {step === 2 ? (
            <form className="space-y-5" onSubmit={handleResetPassword}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  One-Time Password (OTP)
                </label>
                <input
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent text-sm tracking-widest text-center font-bold shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent text-sm shadow-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !otp || !newPassword}
                className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 transition-colors shadow-sm disabled:opacity-70"
              >
                {loading ? "Resetting..." : "Reset Password"}
                {!loading && <KeyRound className="w-4 h-4" />}
              </button>

              <div className="text-center mt-6 pt-6 border-t border-slate-200">
                <button 
                  type="button" 
                  onClick={() => setStep(1)} 
                  className="text-sm font-semibold text-slate-600 hover:text-blue-700 transition-colors"
                >
                  Back to Email Input
                </button>
              </div>
            </form>
          ) : (
            <form className="space-y-5" onSubmit={handleSendOtp}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. registered@email.com"
                  className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent text-sm shadow-sm"
                />
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 transition-colors shadow-sm disabled:opacity-70"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </button>

              <div className="text-center mt-6 pt-6 border-t border-slate-200">
                <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-blue-700 transition-colors">
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
