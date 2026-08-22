import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { loginUser } from "../../services/auth.service";
import { useAuth } from "../../hooks/useAuth";

interface LoginFormProps {
  title: string;
  role: "CITIZEN" | "OFFICER";
}

const LoginForm = ({
  title,
  role,
}: LoginFormProps) => {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [identifier, setIdentifier] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await loginUser({
        identifier,
        password,
        portal: role,
      });

      login(
        res.data.token,
        res.data.user
      );

      toast.success(
        "Login successful"
      );

      switch (res.data.user.role) {
        case "CITIZEN":
          navigate("/dashboard");
          break;

        case "DA":
        case "PATWARI":
        case "TEHSILDAR":
          navigate(
            "/officer/dashboard"
          );
          break;

        case "ADMIN":
          navigate(
            "/admin/dashboard"
          );
          break;

        default:
          navigate("/");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">

        <h1 className="mb-6 text-center text-3xl font-bold">
          {title}
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <input
            type="text"
            placeholder="Email or Phone"
            value={identifier}
            onChange={(e) =>
              setIdentifier(
                e.target.value
              )
            }
            className="w-full rounded-lg border p-3"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="w-full rounded-lg border p-3"
            required
          />

          <button
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 p-3 text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        {role === "CITIZEN" && (
          <p className="mt-5 text-center">
            Don't have an account?{" "}
            <Link
              to="/citizen/register"
              className="text-blue-600 hover:underline"
            >
              Register
            </Link>
          </p>
        )}

        {role === "OFFICER" && (
          <div className="mt-5 rounded-lg bg-blue-50 p-4 text-center text-sm text-blue-700">
            Officer accounts are created by the
            District Administration.
          </div>
        )}

      </div>

    </div>
  );
};

export default LoginForm;