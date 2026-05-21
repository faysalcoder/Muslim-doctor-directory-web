import React, { useState } from "react";
import { BASE_URL } from "../api/axios";

const ALL_SPECIALTIES = [
  "Allergy & Immunology",
  "Anesthesiology",
  "Cardiology",
  "Cardiothoracic Surgery",
  "Colorectal Surgery",
  "Critical Care Medicine",
  "Dentistry & Oral Surgery",
  "Dermatology",
  "Emergency Medicine",
  "Endocrinology",
  "Family Medicine",
  "Gastroenterology",
  "General Practice",
  "General Surgery",
  "Geriatrics",
  "Hematology",
  "Hepatology",
  "Infectious Disease",
  "Internal Medicine",
  "Nephrology",
  "Neurology",
  "Neurosurgery",
  "Obstetrics & Gynecology",
  "Oncology",
  "Ophthalmology",
  "Orthopedic Surgery",
  "Otolaryngology (ENT)",
  "Pain Management",
  "Pathology",
  "Pediatrics",
  "Physical Medicine & Rehabilitation",
  "Plastic Surgery",
  "Psychiatry",
  "Pulmonology",
  "Radiology",
  "Rheumatology",
  "Sleep Medicine",
  "Sports Medicine",
  "Urology",
  "Vascular Surgery",
];

const emptyForm = {
  name: "",
  title: "",
  academic_title: "",
  academic_affiliation: "",
  medical_school_affiliation: "",
  specialty: "",
  subspecialty: "",
  graduation_degree: "",
  graduation_year: "",
  experience: "",
  gender: "",
  languages: "",
  email: "",
  phone: "",
  location: "",
  practice: "",
  address: "",
  hospital_1: "",
  hospital_2: "",
  hospital_3: "",
  hospital_4: "",
  awards: "",
  bio: "",
  accepting_patients: "0",
};

export default function AddDoctorModal({ open, onClose }) {
  const [form, setForm]               = useState(emptyForm);
  const [profileImage, setProfileImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [submitting, setSubmitting]   = useState(false);
  const [step, setStep]               = useState(1);
  const [error, setError]             = useState("");

  if (!open) return null;

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleProfileImage = (e) => {
    const file = e.target.files?.[0] || null;
    setProfileImage(file);
    if (file) setProfilePreview(URL.createObjectURL(file));
  };

  const handleClose = () => {
    setForm(emptyForm);
    setProfileImage(null);
    setProfilePreview(null);
    setSubmitting(false);
    setError("");
    setStep(1);
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const hospitals = [form.hospital_1, form.hospital_2, form.hospital_3, form.hospital_4]
        .map((h) => h.trim()).filter(Boolean).join(" | ");

      const education = [
        form.graduation_degree && form.graduation_year
          ? `${form.graduation_degree} (${form.graduation_year})`
          : form.graduation_degree || form.graduation_year,
        form.academic_title,
        form.academic_affiliation,
        form.medical_school_affiliation,
      ].filter(Boolean).join("; ");

      const fd = new FormData();
      fd.append("name",                    form.name);
      fd.append("title",                   form.title);
      fd.append("specialty",               form.specialty);
      fd.append("subspecialty",            form.subspecialty);
      fd.append("email",                   form.email);
      fd.append("phone",                   form.phone);
      fd.append("location",                form.location);
      fd.append("practice",                form.practice);
      fd.append("address",                 form.address);
      fd.append("bio",                     form.bio);
      fd.append("education",               education);
      fd.append("experience",              form.experience);
      fd.append("gender",                  form.gender);
      fd.append("languages",               form.languages);
      fd.append("accepting_patients",      form.accepting_patients);
      fd.append("hospital_affiliations",   hospitals);
      fd.append("awards",                  form.awards);
      fd.append("academic_title",          form.academic_title);
      fd.append("academic_affiliation",     form.academic_affiliation);
      fd.append("medical_school_affiliation", form.medical_school_affiliation);
      fd.append("graduation_degree",       form.graduation_degree);
      fd.append("graduation_year",         form.graduation_year);
      if (profileImage) fd.append("profile_image", profileImage);

      const res = await fetch(`${BASE_URL}/doctors/public-apply.php`, {
        method: "POST",
        body: fd,
      });

      let data = null;
      try { data = await res.json(); } catch (_) {}

      if (!res.ok || !data?.success) {
        throw new Error(data?.message || `Server error (${res.status}). Please try again.`);
      }

      setStep(2);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl my-8 overflow-hidden">

        {/* Header */}
        <div className="bg-[#00342b] px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white/10 rounded-xl p-2">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Network of Muslim Physicians</h3>
              <p className="text-white/70 text-sm">Sign Up — Your profile will be reviewed before going live</p>
            </div>
          </div>
          <button type="button" onClick={handleClose} className="text-white/70 hover:text-white transition text-3xl leading-none">×</button>
        </div>

        {step === 2 ? (
          /* Success */
          <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
            <div className="bg-emerald-100 rounded-full p-5 mb-6">
              <svg className="w-12 h-12 text-[#00342b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="text-2xl font-bold text-gray-800 mb-3">Application Submitted!</h4>
            <p className="text-gray-500 max-w-md mb-8">
              Thank you for joining the Network of Muslim Physicians! Your profile has been submitted
              for review. Our team will verify your credentials and publish your listing shortly.
            </p>
            <button onClick={handleClose} className="bg-[#00342b] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#00493c] transition">
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">

            {/* ── 1. Personal Information ── */}
            <Section label="Personal Information">
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Full Name" required value={form.name} onChange={(v) => setField("name", v)} placeholder="Dr. Fatima Al-Hassan" />
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Gender <Required /></label>
                  <select
                    value={form.gender}
                    onChange={(e) => setField("gender", e.target.value)}
                    required
                    className={selectCls}
                  >
                    <option value="">Select…</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <Field
                  label="Languages Spoken"
                  required
                  value={form.languages}
                  onChange={(v) => setField("languages", v)}
                  placeholder="English, Arabic, Urdu"
                  className="md:col-span-2"
                />
              </div>
            </Section>

            {/* ── 2. Credentials & Title ── */}
            <Section label="Credentials & Title">
              <div className="grid md:grid-cols-2 gap-4">
                <Field
                  label="Medical Title / Credentials"
                  required
                  value={form.title}
                  onChange={(v) => setField("title", v)}
                  placeholder="MD, FACC, FACS"
                  hint="Post-nominal letters after your name"
                />
                <Field
                  label="Academic Title"
                  value={form.academic_title}
                  onChange={(v) => setField("academic_title", v)}
                  placeholder="Associate Professor, Clinical Instructor"
                  hint="Your academic rank or position, if applicable"
                />
                <Field
                  label="Academic Affiliation"
                  value={form.academic_affiliation}
                  onChange={(v) => setField("academic_affiliation", v)}
                  placeholder="Department of Medicine, XYZ University"
                  hint="Your academic department, institute, or faculty"
                />
                <Field
                  label="Medical School Attended"
                  value={form.medical_school_affiliation}
                  onChange={(v) => setField("medical_school_affiliation", v)}
                  placeholder="Harvard Medical School"
                  className="md:col-span-2"
                  hint="Medical school the doctor attended"
                />
              </div>
            </Section>

            {/* ── 3. Education ── */}
            <Section label="Education">
              <div className="grid md:grid-cols-2 gap-4">
                <Field
                  label="Graduation Degree"
                  required
                  value={form.graduation_degree}
                  onChange={(v) => setField("graduation_degree", v)}
                  placeholder="MD, MBBS, DO, FCPS"
                />
                <Field
                  label="Graduation Year"
                  required
                  value={form.graduation_year}
                  onChange={(v) => setField("graduation_year", v)}
                  placeholder="2005"
                  type="number"
                  min="1950"
                  max={new Date().getFullYear()}
                />
                <Field
                  label="Years of Experience"
                  required
                  value={form.experience}
                  onChange={(v) => setField("experience", v)}
                  placeholder="12"
                  type="number"
                  min="0"
                  className="md:col-span-2"
                />
              </div>
            </Section>

            {/* ── 4. Specialty ── */}
            <Section label="Specialty">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Specialty <Required /></label>
                  <select
                    value={form.specialty}
                    onChange={(e) => setField("specialty", e.target.value)}
                    required
                    className={selectCls}
                  >
                    <option value="">Select specialty…</option>
                    {ALL_SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <Field
                  label="Subspecialty"
                  value={form.subspecialty}
                  onChange={(v) => setField("subspecialty", v)}
                  placeholder="e.g. Interventional Cardiology, Pediatric Neurology"
                  hint="Your specific area of focus within your specialty"
                />
              </div>
            </Section>

            {/* ── 5. Hospital Affiliations ── */}
            <Section label="Hospital Affiliations">
              <p className="text-xs text-gray-500 mb-3">List up to four hospitals or medical centers where you practice.</p>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Hospital 1" required value={form.hospital_1} onChange={(v) => setField("hospital_1", v)} placeholder="Massachusetts General Hospital" />
                <Field label="Hospital 2" value={form.hospital_2} onChange={(v) => setField("hospital_2", v)} placeholder="Optional" />
                <Field label="Hospital 3" value={form.hospital_3} onChange={(v) => setField("hospital_3", v)} placeholder="Optional" />
                <Field label="Hospital 4" value={form.hospital_4} onChange={(v) => setField("hospital_4", v)} placeholder="Optional" />
              </div>
            </Section>

            {/* ── 6. Practice & Contact ── */}
            <Section label="Practice & Contact">
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Email Address" required value={form.email} onChange={(v) => setField("email", v)} placeholder="dr.name@example.com" type="email" />
                <Field label="Phone Number" required value={form.phone} onChange={(v) => setField("phone", v)} placeholder="+1 555 000 0000" />
                <Field label="Clinic / Practice Name" required value={form.practice} onChange={(v) => setField("practice", v)} placeholder="Islamic Medical Associates" />
                <Field label="City / State / Country" required value={form.location} onChange={(v) => setField("location", v)} placeholder="Houston, TX, USA" />
                <Field label="Full Practice Address" value={form.address} onChange={(v) => setField("address", v)} placeholder="123 Main St, Suite 400, Houston, TX 77001" className="md:col-span-2" />
              </div>
              <div className="flex items-center gap-3 mt-4">
                <input
                  type="checkbox"
                  id="pub_accepting"
                  checked={form.accepting_patients === "1"}
                  onChange={(e) => setField("accepting_patients", e.target.checked ? "1" : "0")}
                  className="w-5 h-5 accent-[#00342b]"
                />
                <label htmlFor="pub_accepting" className="text-sm font-semibold text-gray-700 cursor-pointer">
                  I am currently accepting new patients
                </label>
              </div>
            </Section>

            {/* ── 7. Awards & Recognitions ── */}
            <Section label="Special Awards & Recognitions">
              <textarea
                value={form.awards}
                onChange={(e) => setField("awards", e.target.value)}
                rows={3}
                className={textareaCls}
                placeholder="e.g. Best Physician Award 2022 — American Medical Association, Castle Connolly Top Doctor 2021…"
              />
            </Section>

            {/* ── 8. About / Bio ── */}
            <Section label="About You">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Additional Information <Required />
              </label>
              <textarea
                value={form.bio}
                onChange={(e) => setField("bio", e.target.value)}
                rows={5}
                required
                className={textareaCls}
                placeholder="Please include any additional information that will help your patients learn about you."
              />
            </Section>

            {/* ── 9. Profile Photo ── */}
            <Section label="Profile Photo">
              <div className="flex items-start gap-5">
                {profilePreview ? (
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-[#00342b]/20 shrink-0">
                    <img src={profilePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => { setProfileImage(null); setProfilePreview(null); }}
                      className="absolute top-1 right-1 bg-white rounded-full w-5 h-5 text-xs text-red-600 font-bold shadow flex items-center justify-center"
                    >×</button>
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-2xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center shrink-0">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImage}
                    className="text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#00342b]/10 file:text-[#00342b] file:font-semibold file:cursor-pointer"
                  />
                  <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP — max 5 MB</p>
                </div>
              </div>
            </Section>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm flex gap-2 items-start">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            {/* Review notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex gap-3">
              <svg className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-amber-800">
                Your listing will be reviewed by our team before it goes live. You'll be contacted at the email provided.
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
              <button
                type="button"
                onClick={handleClose}
                disabled={submitting}
                className="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-600 font-medium disabled:opacity-50 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-[#00342b] text-white font-semibold disabled:opacity-60 flex items-center gap-2 hover:bg-[#00493c] transition shadow-lg"
              >
                {submitting && (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                )}
                {submitting ? "Submitting…" : "Submit Application"}
              </button>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}

// ── Shared styles ──────────────────────────────────────────────────────────
const selectCls   = "w-full border border-gray-300 rounded-xl px-4 py-3 bg-white text-sm focus:ring-2 focus:ring-[#00342b] focus:border-[#00342b] outline-none";
const textareaCls = "w-full border border-gray-300 rounded-xl px-4 py-3 bg-white text-sm focus:ring-2 focus:ring-[#00342b] focus:border-[#00342b] outline-none";

function Required() {
  return <span className="text-red-500 ml-0.5">*</span>;
}

function Section({ label, children }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-[#00342b]/60 mb-3 pb-1.5 border-b border-gray-100">{label}</p>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, className = "", type = "text", required = false, hint, min, max }) {
  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-gray-700 mb-1">
        {label} {required && <Required />}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white text-sm focus:ring-2 focus:ring-[#00342b] focus:border-[#00342b] outline-none"
      />
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}
