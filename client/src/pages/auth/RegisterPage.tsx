import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Landmark } from "lucide-react";
import { registerUser } from "../../services/auth.service";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      await registerUser(form);

      toast.success("Registration successful");

      navigate("/login");
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Registration failed"
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
          Create Citizen Account
        </h2>
        <p className="text-sm text-slate-600">Join the official digital public services portal</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white border border-slate-200 py-8 px-6 shadow-sm rounded-xl sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Full Name (As per Aadhar)
              </label>
              <input
                name="fullName"
                type="text"
                required
                minLength={3}
                placeholder="e.g. Ramesh Kumar"
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent text-sm shadow-sm"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="e.g. applicant@email.com"
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent text-sm shadow-sm"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Mobile Number
              </label>
              <input
                name="phone"
                type="tel"
                required
                pattern="[6-9][0-9]{9}"
                placeholder="e.g. 98XXXXXXXX"
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent text-sm shadow-sm"
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Create Password
              </label>
              <input
                name="password"
                type="password"
                required
                minLength={8}
                placeholder="••••••••"
                className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-md text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent text-sm shadow-sm"
                onChange={handleChange}
              />
              <p className="mt-1 text-xs text-slate-500">Must be at least 8 characters long</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 flex items-center justify-center gap-2 py-2.5 px-4 rounded-md text-sm font-semibold text-white bg-blue-700 hover:bg-blue-800 transition-colors shadow-sm disabled:opacity-70"
            >
              {loading ? "Creating Account..." : "Register Account"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-200 text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-blue-700 hover:text-blue-800">
                Sign In here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}