import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginMember } from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";

export default function DoctorLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginMember(form.email.trim(), form.password);
      if (res?.success && res.token) {
        login(res.user, res.token);
        toast.success(`Welcome back, ${res.user?.name || "Doctor"}!`);
        navigate(res.user?.role === "member" ? "/account" : "/admin/dashboard", { replace: true });
      } else {
        toast.error(res?.message || "Invalid email or password");
      }
    } catch (err) {
      toast.error(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
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
              <p className="text-[10px] tracking-[0.28em] font-semibold text-gray-500 uppercase">Network of</p>
              <p className="text-base font-extrabold text-gray-900 uppercase">Muslim Physicians</p>
            </div>
          </div>

          <h2 className="text-2xl font-extrabold text-[#00342b] mb-1">Sign In</h2>
          <p className="text-sm text-gray-500 mb-8">
            Manage your profile, forum posts, and job listings.
          </p>

          <form onSubmit={submit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="dr.name@example.com"
                className="w-full h-[52px] border border-gray-300 rounded-xl px-4 focus:ring-2 focus:ring-[#00342b] focus:border-[#00342b] outline-none transition text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full h-[52px] border border-gray-300 rounded-xl px-4 pr-12 focus:ring-2 focus:ring-[#00342b] focus:border-[#00342b] outline-none transition text-base"
                />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword
                    ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
                    : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /><path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[52px] bg-[#00342b] text-white rounded-xl font-bold text-base hover:bg-[#00493c] transition disabled:opacity-60 shadow-lg shadow-[#00342b]/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Signing in...
                </>
              ) : "Sign In"}
            </button>
          </form>

          <div className="mt-6 space-y-3 text-center text-sm">
            <p className="text-gray-500">
              Don't have an account?{" "}
              <Link to="/doctor-signup" className="text-[#00342b] font-semibold hover:underline">Create one here</Link>
            </p>
            <p>
              <Link to="/" className="text-gray-400 hover:text-gray-600">← Back to public site</Link>
            </p>
            <p>
              <Link to="/login" className="text-gray-300 hover:text-gray-500 text-xs">Admin login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
