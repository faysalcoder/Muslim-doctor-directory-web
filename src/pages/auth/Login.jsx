import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../auth/AuthContext";
import { loginAdmin } from "../../api/axios";

export default function Login() {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (user.role === 'member') navigate('/account', { replace: true });
    else navigate('/admin/dashboard', { replace: true });
  }, [user, navigate]);

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginAdmin(form.email.trim(), form.password);

      if (res?.success && res.token) {
        login(res.user, res.token);
        toast.success(`Welcome back, ${res.user?.name || "Admin"}!`);
        navigate(res.user?.role === 'member' ? '/account' : '/admin/dashboard', { replace: true });
      } else {
        toast.error(res?.message || "Invalid credentials");
      }
    } catch (err) {
      toast.error("Login failed. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00342b] to-[#004d3d] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-[#00342b] text-white rounded-xl h-12 w-12 flex items-center justify-center text-2xl font-bold shadow-lg">
              N
            </div>
            <div className="leading-tight">
              <p className="text-[10px] tracking-[0.28em] font-semibold text-gray-500 uppercase">
                Network of
              </p>
              <p className="text-base font-extrabold text-gray-900 uppercase">
                Muslim Physicians
              </p>
            </div>
          </div>

          <h2 className="text-2xl font-extrabold text-[#00342b] mb-1">
            Admin Login
          </h2>
          <p className="text-sm text-gray-500 mb-8">
            Sign in to manage the physician portal
          </p>

          {/* Credentials hint */}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="admin@example.com"
                className="w-full h-[52px] border border-gray-300 rounded-xl px-4 focus:ring-2 focus:ring-[#00342b] focus:border-[#00342b] outline-none transition text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPw ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full h-[52px] border border-gray-300 rounded-xl px-4 pr-12 focus:ring-2 focus:ring-[#00342b] focus:border-[#00342b] outline-none transition text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPw ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                      <path
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[52px] bg-[#00342b] text-white rounded-xl font-bold text-base hover:bg-[#00493c] transition disabled:opacity-60 shadow-lg shadow-[#00342b]/20"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 flex flex-col items-center gap-2">
            <div className="flex items-center gap-4 text-sm">
              <Link to="/doctor-login" className="text-[#00342b] font-medium hover:underline">Doctor login</Link>
              <Link to="/doctor-signup" className="text-[#00342b] font-medium hover:underline">Doctor signup</Link>
            </div>
            <Link
              to="/"
              className="text-sm text-[#00342b] font-medium hover:underline"
            >
              ← Back to public site
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
