import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createJobPost } from "../../api/axios";

const FIELDS = [
  { key: "post_name", label: "Job Title", placeholder: "e.g. Cardiologist Needed" },
  { key: "hospital_name", label: "Hospital / Clinic Name", placeholder: "e.g. City Medical Center" },
  { key: "job_location", label: "Location", placeholder: "e.g. New York, NY" },
  { key: "vacancy_available", label: "Vacancies Available", placeholder: "e.g. 2", type: "number" },
];

export default function CreateJobPost() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    post_name: "",
    job_location: "",
    hospital_name: "",
    vacancy_available: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();

    // JS-level validation — catches the issue when HTML required is bypassed
    const empty = FIELDS.filter((f) => !form[f.key]?.toString().trim());
    if (empty.length > 0) {
      toast.error(`Please fill in: ${empty.map((f) => f.label).join(", ")}`);
      return;
    }
    if (!form.description.trim()) {
      toast.error("Please enter a job description");
      return;
    }

    setSaving(true);
    try {
      await createJobPost(form);
      toast.success("Job post created successfully!");
      navigate("/jobs");
    } catch (err) {
      toast.error(err.message || "Failed to create job post");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
        {/* Header */}
        <div className="bg-[#00342b] px-8 py-6">
          <h1 className="text-2xl font-extrabold text-white">Create Job Post</h1>
          <p className="text-emerald-200 text-sm mt-1">Fill all fields to publish your job listing</p>
        </div>

        <form onSubmit={submit} className="p-8 space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            {FIELDS.map(({ key, label, placeholder, type = "text" }) => (
              <div key={key} className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                  {label} <span className="text-red-500">*</span>
                </label>
                <input
                  type={type}
                  name={key}
                  value={form[key]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  min={type === "number" ? "1" : undefined}
                  className={`w-full h-12 border rounded-xl px-4 text-sm outline-none transition focus:ring-2 focus:ring-[#00342b] focus:border-[#00342b] ${
                    form[key]?.toString().trim() === "" && saving === false
                      ? "border-gray-200"
                      : "border-gray-200"
                  }`}
                />
              </div>
            ))}
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
              Job Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the role, responsibilities, requirements, benefits, etc."
              rows={7}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00342b] focus:border-[#00342b] resize-y"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 rounded-xl border border-gray-300 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-7 py-2.5 rounded-xl bg-[#00342b] text-white font-bold text-sm hover:bg-[#00493c] transition disabled:opacity-60 flex items-center gap-2"
            >
              {saving && (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
              )}
              {saving ? "Publishing…" : "Publish Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
