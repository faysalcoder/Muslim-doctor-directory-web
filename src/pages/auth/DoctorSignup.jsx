import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { registerMember } from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";

export default function DoctorSignup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Please enter a valid email";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    if (!form.confirmPassword) e.confirmPassword = "Please confirm your password";
    else if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    return e;
  };

  const submit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    try {
      const res = await registerMember({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      if (res?.success) {
        login(res.user, res.token);
        toast.success("Account created successfully! Welcome.");
        navigate("/account/profile");
      } else {
        toast.error(res?.message || "Signup failed. Please try again.");
      }
    } catch (err) {
      toast.error(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const setField = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: "" }));
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

          <h2 className="text-2xl font-extrabold text-[#00342b] mb-1">Create Your Account</h2>
          <p className="text-sm text-gray-500 mb-8">
            Join the network. Already listed?{" "}
            <Link to="/doctor-login" className="text-[#00342b] font-semibold hover:underline">Sign in here</Link>
          </p>

          <form onSubmit={submit} className="space-y-4" noValidate>
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={e => setField("name", e.target.value)}
                placeholder="Dr. Ahmed Al-Rashid"
                className={`w-full h-[52px] border rounded-xl px-4 text-base outline-none transition focus:ring-2 focus:ring-[#00342b] focus:border-[#00342b] ${errors.name ? "border-red-400 bg-red-50" : "border-gray-300"}`}
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setField("email", e.target.value)}
                placeholder="dr.name@example.com"
                className={`w-full h-[52px] border rounded-xl px-4 text-base outline-none transition focus:ring-2 focus:ring-[#00342b] focus:border-[#00342b] ${errors.email ? "border-red-400 bg-red-50" : "border-gray-300"}`}
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Phone Number <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={e => setField("phone", e.target.value)}
                placeholder="+1 555 000 0000"
                className="w-full h-[52px] border border-gray-300 rounded-xl px-4 text-base outline-none transition focus:ring-2 focus:ring-[#00342b] focus:border-[#00342b]"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={e => setField("password", e.target.value)}
                  placeholder="Minimum 6 characters"
                  className={`w-full h-[52px] border rounded-xl px-4 pr-12 text-base outline-none transition focus:ring-2 focus:ring-[#00342b] focus:border-[#00342b] ${errors.password ? "border-red-400 bg-red-50" : "border-gray-300"}`}
                />
                <button type="button" onClick={() => setShowPassword(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPassword
                    ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                    : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={e => setField("confirmPassword", e.target.value)}
                  placeholder="Re-enter your password"
                  className={`w-full h-[52px] border rounded-xl px-4 pr-12 text-base outline-none transition focus:ring-2 focus:ring-[#00342b] focus:border-[#00342b] ${errors.confirmPassword ? "border-red-400 bg-red-50" : "border-gray-300"}`}
                />
                <button type="button" onClick={() => setShowConfirm(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showConfirm
                    ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                    : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[52px] bg-[#00342b] text-white rounded-xl font-bold text-base hover:bg-[#00493c] transition disabled:opacity-60 shadow-lg shadow-[#00342b]/20 mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Creating account...
                </>
              ) : "Create Account"}
            </button>
          </form>

          <div className="mt-6 space-y-2 text-center text-sm">
            <p className="text-gray-500">
              Already have an account?{" "}
              <Link to="/doctor-login" className="text-[#00342b] font-semibold hover:underline">Sign in</Link>
            </p>
            <p>
              <Link to="/login" className="text-gray-400 hover:text-gray-600">Admin login →</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
