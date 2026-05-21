import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginAdmin, saveSession } from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const auth = useAuth();

  if (!auth) {
    throw new Error("Login must be used inside AuthProvider");
  }

  const { login } = auth;

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await loginAdmin(form.email, form.password);

      if (res.success) {
        saveSession(res.user, res.token);
        login(res.user, res.token);
        toast.success("Login successful");
        navigate("/admin/dashboard");
      } else {
        toast.error(res.message || "Login failed");
      }
    } catch (err) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
      />
      <button type="submit" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
