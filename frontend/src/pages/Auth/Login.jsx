import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff, FiLock, FiUser } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { errorMessage } from "../../services/api";
import { BRAND_NAME } from "../../config";
import { FormError } from "../../components/Feedback";

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  const onSubmit = async ({ username, password }) => {
    setServerError("");
    try {
      await login(username.trim(), password);
      navigate(redirectTo, { replace: true });
    } catch (e) {
      setServerError(
        e?.response?.status === 401
          ? "Incorrect username or password."
          : errorMessage(e),
      );
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#F5F2ED]">
      {/* Brand panel */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-[#1b1816] via-[#2c2118] to-[#C76A12] text-white p-12">
        <Link to="/" className="text-2xl font-semibold">{BRAND_NAME}</Link>
        <div>
          <h2 className="text-5xl font-serif leading-tight">
            Every room, guest and payment — in one calm place.
          </h2>
          <p className="mt-4 text-white/70 max-w-md">
            Sign in to manage today&apos;s arrivals, track balances and keep your
            guest house running smoothly.
          </p>
        </div>
        <p className="text-sm text-white/50">© {new Date().getFullYear()} {BRAND_NAME}</p>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-sm p-8">
          <Link to="/" className="lg:hidden text-xl font-semibold text-[#C76A12]">
            {BRAND_NAME}
          </Link>
          <h1 className="text-3xl font-serif mt-2">Welcome back</h1>
          <p className="text-gray-500 mt-1 mb-6">Sign in with your staff account.</p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <FormError message={serverError} />

            <div>
              <label htmlFor="username" className="block mb-2 text-sm">Username</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="username"
                  autoComplete="username"
                  {...register("username", { required: "Username is required" })}
                  className="w-full border border-gray-300 rounded-xl p-3 pl-10 focus:outline-none focus:border-[#C76A12]"
                />
              </div>
              {errors.username && <p className="text-xs text-red-600 mt-1">{errors.username.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-sm">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  {...register("password", { required: "Password is required" })}
                  className="w-full border border-gray-300 rounded-xl p-3 pl-10 pr-10 focus:outline-none focus:border-[#C76A12]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#C76A12] text-white rounded-xl py-3 font-medium disabled:opacity-60"
            >
              {isSubmitting ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="text-xs text-gray-400 mt-6 text-center">
            Accounts are created by the administrator. <Link to="/" className="underline">Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
