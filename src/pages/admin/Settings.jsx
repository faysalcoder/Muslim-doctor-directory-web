import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import toast from "react-hot-toast";
import { getSettings, updateSettings, changePassword } from "../../api/axios";

export default function Settings() {
  const [siteName,   setSiteName]   = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [saving, setSaving] = useState(false);

  const [pwForm,   setPwForm]   = useState({ current: "", next: "", confirm: "" });
  const [pwSaving, setPwSaving] = useState(false);

  // Load settings from backend on mount
  useEffect(() => {
    (async () => {
      try {
        const res = await getSettings();
        if (res?.success && res.settings) {
          setSiteName(res.settings.site_name   || "");
          setAdminEmail(res.settings.admin_email || "");
        }
      } catch {
        toast.error("Could not load settings");
      } finally {
        setLoadingSettings(false);
      }
    })();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!siteName.trim()) { toast.error("Site name is required"); return; }
    setSaving(true);
    try {
      const res = await updateSettings(siteName.trim(), adminEmail.trim());
      if (res?.success) {
        toast.success("Settings saved successfully!");
      } else {
        toast.error(res?.message || "Failed to save settings");
      }
    } catch {
      toast.error("Something went wrong");
    }
    setSaving(false);
  };

  const handlePwChange = async (e) => {
    e.preventDefault();
    if (pwForm.next !== pwForm.confirm) { toast.error("New passwords do not match"); return; }
    if (pwForm.next.length < 6) { toast.error("New password must be at least 6 characters"); return; }
    setPwSaving(true);
    try {
      const res = await changePassword(pwForm.current, pwForm.next, pwForm.confirm);
      if (res?.success) {
        toast.success("Password updated successfully!");
        setPwForm({ current: "", next: "", confirm: "" });
      } else {
        toast.error(res?.message || "Failed to update password");
      }
    } catch {
      toast.error("Something went wrong");
    }
    setPwSaving(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-2xl">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#00342b]">
            Settings
          </h2>
          <p className="text-sm text-[#3f4945] mt-1">
            Configure portal preferences and admin account
          </p>
        </div>

        {/* ── General Settings ── */}
        <form
          onSubmit={handleSave}
          className="bg-white rounded-2xl border border-[#e1e3e4] p-6 space-y-4"
        >
          <h3 className="text-lg font-bold text-[#00342b]">General</h3>

          {loadingSettings ? (
            <div className="space-y-3 animate-pulse">
              <div className="h-10 bg-gray-100 rounded-xl" />
              <div className="h-10 bg-gray-100 rounded-xl" />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-semibold text-[#3f4945] mb-1">
                  Site Name
                </label>
                <input
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="Network of Muslim Physicians"
                  className="w-full border border-[#bfc9c4] rounded-xl px-4 py-3 bg-white text-sm focus:ring-2 focus:ring-[#00342b] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#3f4945] mb-1">
                  Admin Email
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@nomp.com"
                  className="w-full border border-[#bfc9c4] rounded-xl px-4 py-3 bg-white text-sm focus:ring-2 focus:ring-[#00342b] outline-none"
                />
              </div>
            </>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving || loadingSettings}
              className="px-5 py-2.5 rounded-xl bg-[#00342b] text-white font-semibold text-sm disabled:opacity-60 hover:bg-[#004d3d] transition"
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>
          </div>
        </form>

        {/* ── Change Password ── */}
        <form
          onSubmit={handlePwChange}
          className="bg-white rounded-2xl border border-[#e1e3e4] p-6 space-y-4"
        >
          <h3 className="text-lg font-bold text-[#00342b]">Change Password</h3>

          {[
            { label: "Current Password",     key: "current" },
            { label: "New Password",          key: "next"    },
            { label: "Confirm New Password",  key: "confirm" },
          ].map(({ label, key }) => (
            <div key={key}>
              <label className="block text-sm font-semibold text-[#3f4945] mb-1">
                {label}
              </label>
              <input
                type="password"
                value={pwForm[key]}
                onChange={(e) => setPwForm((p) => ({ ...p, [key]: e.target.value }))}
                className="w-full border border-[#bfc9c4] rounded-xl px-4 py-3 bg-white text-sm focus:ring-2 focus:ring-[#00342b] outline-none"
                required
              />
            </div>
          ))}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={pwSaving}
              className="px-5 py-2.5 rounded-xl bg-[#00342b] text-white font-semibold text-sm disabled:opacity-60 hover:bg-[#004d3d] transition"
            >
              {pwSaving ? "Updating..." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
