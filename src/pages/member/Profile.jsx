import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  changeMemberPassword,
  getMemberProfile,
  updateMemberProfile,
} from "../../api/axios";
import { BASE_URL } from "../../api/axios";

const ALL_SPECIALTIES = [
  "Allergy & Immunology","Anesthesiology","Cardiology","Cardiothoracic Surgery",
  "Colorectal Surgery","Critical Care Medicine","Dentistry & Oral Surgery","Dermatology",
  "Emergency Medicine","Endocrinology","Family Medicine","Gastroenterology",
  "General Practice","General Surgery","Geriatrics","Hematology","Hepatology",
  "Infectious Disease","Internal Medicine","Nephrology","Neurology","Neurosurgery",
  "Obstetrics & Gynecology","Oncology","Ophthalmology","Orthopedic Surgery",
  "Otolaryngology (ENT)","Pain Management","Pathology","Pediatrics",
  "Physical Medicine & Rehabilitation","Plastic Surgery","Psychiatry","Pulmonology",
  "Radiology","Rheumatology","Sleep Medicine","Sports Medicine","Urology","Vascular Surgery",
];

function Field({ label, name, value, onChange, type = "text", hint, required = false, placeholder, min, max, className = "" }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}{required ? <span className="text-red-500 ml-1">*</span> : null}
      </label>
      <input
        type={type} name={name} value={value || ""} onChange={onChange}
        placeholder={placeholder || label} required={required} min={min} max={max}
        className="w-full h-11 border border-gray-200 rounded-xl px-4 text-sm focus:ring-2 focus:ring-[#00342b] focus:border-[#00342b] outline-none bg-white transition"
      />
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}

function Textarea({ label, name, value, onChange, rows = 4, placeholder, className = "" }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</label>
      <textarea
        name={name} rows={rows} value={value || ""} onChange={onChange}
        placeholder={placeholder || label}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#00342b] focus:border-[#00342b] outline-none resize-y bg-white transition"
      />
    </div>
  );
}

function Select({ label, name, value, onChange, options, className = "" }) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</label>
      <select
        name={name} value={value || ""} onChange={onChange}
        className="w-full h-11 border border-gray-200 rounded-xl px-4 text-sm focus:ring-2 focus:ring-[#00342b] focus:border-[#00342b] outline-none bg-white transition"
      >
        {options.map(([val, lab]) => <option key={val} value={val}>{lab}</option>)}
      </select>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    verified: "bg-emerald-100 text-emerald-700 border-emerald-200",
    pending: "bg-amber-100 text-amber-700 border-amber-200",
    inactive: "bg-red-100 text-red-600 border-red-200",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${map[status] || "bg-gray-100 text-gray-600 border-gray-200"}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Pending"}
    </span>
  );
}

function parseAddress(address = "") {
  if (!address || typeof address !== "string") return { street: "", city: "", state: "", zip: "", county: "" };
  const parts = address.split("|").map((p) => p.trim()).filter(Boolean);
  return { street: parts[0] || "", city: parts[1] || "", state: parts[2] || "", zip: parts[3] || "", county: parts[4] || "" };
}

function buildAddress({ street, city, state, zip, county }) {
  return [street, city, state, zip, county].filter(Boolean).join(" | ");
}

function safeString(value) {
  if (value === null || value === undefined) return "";
  return String(value);
}

const TABS = [
  { id: "personal", label: "Personal Info", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
  { id: "practice", label: "Practice", icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" },
  { id: "credentials", label: "Credentials", icon: "M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" },
  { id: "affiliations", label: "Affiliations", icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" },
  { id: "about", label: "About", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
  { id: "password", label: "Password", icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" },
];

export default function MemberProfile() {
  const [activeTab, setActiveTab] = useState("personal");
  const [form, setForm] = useState({
    name: "", title: "", academic_title: "", academic_affiliation: "",
    medical_school_affiliation: "", specialty: "", subspecialty: "",
    graduation_degree: "", graduation_year: "", experience: "", gender: "",
    languages: "", email: "", phone: "", practice: "", street: "", city: "",
    state: "", zip: "", county: "", hospital_1: "", hospital_2: "",
    hospital_3: "", hospital_4: "", awards: "", bio: "", accepting_patients: "0", address: "",
  });
  const [pwd, setPwd] = useState({ current_password: "", new_password: "", confirm_password: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileRef = useRef();

  useEffect(() => {
    (async () => {
      try {
        const res = await getMemberProfile();
        const profile = res.data?.profile || {};
        const parsedAddress = parseAddress(profile.address || "");
        const hospitalParts = safeString(profile.hospital_affiliations).split("|").map((x) => x.trim()).filter(Boolean);
        setForm({
          name: profile.name || "", title: profile.title || "",
          academic_title: profile.academic_title || "", academic_affiliation: profile.academic_affiliation || "",
          medical_school_affiliation: profile.medical_school_affiliation || "",
          specialty: profile.specialty || "", subspecialty: profile.subspecialty || "",
          graduation_degree: profile.graduation_degree || "", graduation_year: profile.graduation_year || "",
          experience: profile.experience || "", gender: profile.gender || "",
          languages: profile.languages || "", email: profile.email || "",
          phone: profile.phone || "", practice: profile.practice || "",
          street: parsedAddress.street || "", city: parsedAddress.city || "",
          state: parsedAddress.state || "", zip: parsedAddress.zip || "",
          county: parsedAddress.county || "",
          hospital_1: hospitalParts[0] || "", hospital_2: hospitalParts[1] || "",
          hospital_3: hospitalParts[2] || "", hospital_4: hospitalParts[3] || "",
          awards: profile.awards || "", bio: profile.bio || "",
          accepting_patients: String(profile.accepting_patients) === "1" ? "1" : "0",
          address: profile.address || "", status: profile.status || "", id: profile.id,
        });
        if (profile.profile_image) {
          setImagePreview(
            String(profile.profile_image).startsWith("http")
              ? profile.profile_image
              : `${BASE_URL}/uploads/doctors/${profile.profile_image}`
          );
        }
      } catch (e) {
        toast.error(e.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (["street", "city", "state", "zip", "county"].includes(name)) {
        next.address = buildAddress({ street: next.street, city: next.city, state: next.state, zip: next.zip, county: next.county });
      }
      return next;
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { toast.error("Image must be under 5MB"); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const hospitals = [form.hospital_1, form.hospital_2, form.hospital_3, form.hospital_4]
        .map((h) => h.trim()).filter(Boolean).join(" | ");
      const fullAddress = buildAddress({ street: form.street, city: form.city, state: form.state, zip: form.zip, county: form.county });
      const payload = {
        name: form.name, title: form.title, specialty: form.specialty, subspecialty: form.subspecialty,
        email: form.email, phone: form.phone, location: form.city.trim(), practice: form.practice,
        address: fullAddress, bio: form.bio,
        education: [
          form.graduation_degree && form.graduation_year ? `${form.graduation_degree} (${form.graduation_year})` : form.graduation_degree || form.graduation_year,
          form.academic_title, form.academic_affiliation, form.medical_school_affiliation,
        ].filter(Boolean).join("; "),
        experience: form.experience, gender: form.gender, languages: form.languages,
        accepting_patients: form.accepting_patients, hospital_affiliations: hospitals,
        awards: form.awards, academic_title: form.academic_title, academic_affiliation: form.academic_affiliation,
        medical_school_affiliation: form.medical_school_affiliation, graduation_degree: form.graduation_degree,
        graduation_year: form.graduation_year, street: form.street, city: form.city,
        state: form.state, zip: form.zip, county: form.county,
      };
      if (imageFile) {
        const fd = new FormData();
        Object.entries(payload).forEach(([k, v]) => { if (v !== null && v !== undefined) fd.append(k, v); });
        fd.append("profile_image", imageFile);
        await updateMemberProfile(fd);
      } else {
        await updateMemberProfile(payload);
      }
      toast.success("Profile saved successfully!");
      setImageFile(null);
    } catch (e) {
      toast.error(e.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    if (pwd.new_password !== pwd.confirm_password) { toast.error("New passwords do not match"); return; }
    if (pwd.new_password.length < 6) { toast.error("Password must be at least 6 characters"); return; }
    try {
      await changeMemberPassword(pwd.current_password, pwd.new_password);
      toast.success("Password updated!");
      setPwd({ current_password: "", new_password: "", confirm_password: "" });
    } catch (e) {
      toast.error(e.message || "Password change failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <svg className="w-8 h-8 animate-spin text-[#00342b]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
          <p className="text-[#00342b] font-semibold text-sm">Loading your profile…</p>
        </div>
      </div>
    );
  }

  const addressPreview = buildAddress({ street: form.street, city: form.city, state: form.state, zip: form.zip, county: form.county });
  const hospitalPreview = [form.hospital_1, form.hospital_2, form.hospital_3, form.hospital_4].filter(Boolean).join(" | ");
  const educationPreview = [
    form.graduation_degree && form.graduation_year ? `${form.graduation_degree} (${form.graduation_year})` : form.graduation_degree || form.graduation_year,
    form.academic_title, form.academic_affiliation, form.medical_school_affiliation,
  ].filter(Boolean).join("; ");

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex gap-6 items-start">

        {/* ── LEFT SIDEBAR (always visible) ── */}
        <aside className="w-64 shrink-0 sticky top-6 space-y-4">
          {/* Profile Card */}
          <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
            {/* Green top strip */}
            <div className="h-16 bg-gradient-to-br from-[#00342b] to-[#00573f]" />

            <div className="px-5 pb-5 -mt-8">
              {/* Avatar */}
              <div
                className="w-16 h-16 rounded-xl border-4 border-white bg-gray-100 overflow-hidden cursor-pointer hover:opacity-90 transition shadow-md"
                onClick={() => fileRef.current?.click()}
                title="Click to change photo"
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#00342b]/10">
                    <svg className="w-8 h-8 text-[#00342b]/40" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="mt-3">
                <p className="font-extrabold text-[#00342b] text-sm leading-tight">{form.name || "Your Name"}</p>
                {form.title && <p className="text-xs text-gray-400 mt-0.5">{form.title}</p>}
                <p className="text-xs text-gray-500 mt-1 truncate">{form.email}</p>
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5">
                {form.specialty && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <svg className="w-3.5 h-3.5 text-[#00342b] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="truncate">{form.specialty}</span>
                  </div>
                )}
                {form.city && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <svg className="w-3.5 h-3.5 text-[#00342b] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="truncate">{form.city}</span>
                  </div>
                )}
                {form.experience && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-600">
                    <svg className="w-3.5 h-3.5 text-[#00342b] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{form.experience} yrs exp</span>
                  </div>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-gray-100">
                <StatusBadge status={form.status} />
                {form.status !== "verified" && (
                  <p className="text-[10px] text-amber-600 mt-2 leading-relaxed">
                    Awaiting admin verification before appearing publicly.
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="mt-4 w-full py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:border-[#00342b] hover:text-[#00342b] transition"
              >
                {imagePreview ? "Change Photo" : "Upload Photo"}
              </button>
              {imageFile && (
                <p className="text-[10px] text-emerald-600 mt-1 text-center">✓ New photo selected</p>
              )}
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleImageChange} />
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="bg-white border rounded-2xl overflow-hidden shadow-sm">
            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-semibold px-4 pt-3 pb-1">Profile Sections</p>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold transition text-left ${
                  activeTab === tab.id
                    ? "bg-[#00342b] text-white"
                    : "text-gray-600 hover:bg-gray-50 hover:text-[#00342b]"
                }`}
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d={tab.icon} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {tab.label}
                {activeTab === tab.id && (
                  <svg className="w-4 h-4 ml-auto shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            ))}
          </nav>

          {/* Public profile link */}
          {form.id && (
            <a
              href={`/doctor/${form.id}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-2xl border border-[#00342b] text-[#00342b] text-sm font-semibold hover:bg-[#00342b] hover:text-white transition bg-white shadow-sm"
            >
              View Public Profile
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          )}
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 min-w-0">
          {/* Tab header */}
          <div className="mb-5">
            <h1 className="text-2xl font-extrabold text-[#00342b]">
              {TABS.find((t) => t.id === activeTab)?.label}
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {activeTab === "personal" && "Your basic information and contact details"}
              {activeTab === "practice" && "Practice name, address and patient availability"}
              {activeTab === "credentials" && "Specialty, degree and professional certifications"}
              {activeTab === "affiliations" && "Academic institutions and hospital affiliations"}
              {activeTab === "about" && "Biography, education summary and awards"}
              {activeTab === "password" && "Update your account password"}
            </p>
          </div>

          {activeTab !== "password" ? (
            <form onSubmit={saveProfile} className="space-y-5">

              {/* ── PERSONAL INFO ── */}
              {activeTab === "personal" && (
                <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Full Name" name="name" value={form.name} onChange={handleChange} required />
                    <Field label="Phone Number" name="phone" value={form.phone} onChange={handleChange} type="tel" required />
                    <Field label="Email Address" name="email" value={form.email} onChange={handleChange} type="email" required />
                    <Select label="Gender" name="gender" value={form.gender} onChange={handleChange}
                      options={[["", "Select gender"],["Male","Male"],["Female","Female"],["Other","Other"],["Prefer not to say","Prefer not to say"]]} />
                    <Field label="Languages Spoken" name="languages" value={form.languages} onChange={handleChange}
                      hint="Comma-separated: English, Arabic, Urdu" />
                    <Field label="Years of Experience" name="experience" value={form.experience} onChange={handleChange} type="number" min="0" />
                  </div>
                </div>
              )}

              {/* ── PRACTICE ── */}
              {activeTab === "practice" && (
                <div className="space-y-5">
                  <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Practice Name" name="practice" value={form.practice} onChange={handleChange} required className="sm:col-span-2" />
                      <Field label="Street Address" name="street" value={form.street} onChange={handleChange} placeholder="123 Main Street, Suite 400" />
                      <Field label="City" name="city" value={form.city} onChange={handleChange} placeholder="Houston" hint="Used as your public location" />
                      <Field label="State / Province" name="state" value={form.state} onChange={handleChange} placeholder="TX" />
                      <Field label="ZIP / Postal Code" name="zip" value={form.zip} onChange={handleChange} placeholder="77001" />
                      <Field label="County" name="county" value={form.county} onChange={handleChange} placeholder="Harris County" />
                    </div>

                    {addressPreview && (
                      <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                        <p className="text-[10px] uppercase tracking-widest text-[#00342b]/50 font-semibold mb-0.5">Address Preview</p>
                        <p className="text-sm text-[#00342b]">{addressPreview}</p>
                      </div>
                    )}
                  </div>

                  {/* Accepting patients toggle */}
                  <div className="bg-white border rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-gray-800">Accepting New Patients</p>
                        <p className="text-xs text-gray-400 mt-0.5">Show a badge on your public profile indicating availability</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, accepting_patients: prev.accepting_patients === "1" ? "0" : "1" }))}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 ${
                          form.accepting_patients === "1" ? "bg-[#00342b]" : "bg-gray-200"
                        }`}
                      >
                        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                          form.accepting_patients === "1" ? "translate-x-6" : "translate-x-1"
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ── CREDENTIALS ── */}
              {activeTab === "credentials" && (
                <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Title (e.g. MD, DO)" name="title" value={form.title} onChange={handleChange} required />
                    <Select label="Specialty" name="specialty" value={form.specialty} onChange={handleChange}
                      options={[["", "Select specialty"], ...ALL_SPECIALTIES.map((s) => [s, s])]} />
                    <Field label="Subspecialty" name="subspecialty" value={form.subspecialty} onChange={handleChange}
                      hint="e.g. Interventional Cardiology, Pediatric Neurology" />
                    <Field label="Graduation Degree" name="graduation_degree" value={form.graduation_degree} onChange={handleChange}
                      hint="e.g. MD, MBBS, DO" />
                    <Field label="Graduation Year" name="graduation_year" value={form.graduation_year} onChange={handleChange}
                      type="number" hint="e.g. 2005" />
                  </div>
                </div>
              )}

              {/* ── AFFILIATIONS ── */}
              {activeTab === "affiliations" && (
                <div className="space-y-5">
                  <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-gray-700 pb-2 border-b border-gray-100">Academic</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Academic Title" name="academic_title" value={form.academic_title} onChange={handleChange} hint="e.g. Professor, Associate Professor" />
                      <Field label="Academic Affiliation" name="academic_affiliation" value={form.academic_affiliation} onChange={handleChange} hint="University or research institution" />
                      <Field label="Medical School Attended" name="medical_school_affiliation" value={form.medical_school_affiliation} onChange={handleChange} className="sm:col-span-2" />
                    </div>
                  </div>
                  <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-gray-700 pb-2 border-b border-gray-100">Hospital Affiliations</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Field label="Hospital 1" name="hospital_1" value={form.hospital_1} onChange={handleChange} hint="Primary hospital or medical center" />
                      <Field label="Hospital 2" name="hospital_2" value={form.hospital_2} onChange={handleChange} hint="Optional" />
                      <Field label="Hospital 3" name="hospital_3" value={form.hospital_3} onChange={handleChange} hint="Optional" />
                      <Field label="Hospital 4" name="hospital_4" value={form.hospital_4} onChange={handleChange} hint="Optional" />
                    </div>
                    {hospitalPreview && (
                      <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
                        <p className="text-[10px] uppercase tracking-widest text-[#00342b]/50 font-semibold mb-0.5">Preview</p>
                        <p className="text-sm text-[#00342b]">{hospitalPreview}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── ABOUT ── */}
              {activeTab === "about" && (
                <div className="bg-white border rounded-2xl p-6 shadow-sm space-y-4">
                  <Textarea label="Bio / About" name="bio" value={form.bio} onChange={handleChange} rows={5} />
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">Education Summary</label>
                    <div className="w-full border border-gray-100 rounded-xl px-4 py-3 text-sm text-gray-500 bg-gray-50 min-h-[60px]">
                      {educationPreview || <span className="text-gray-300 italic">Automatically built from Credentials tab</span>}
                    </div>
                    <p className="text-xs text-gray-400">Automatically generated from your Credentials & Affiliations</p>
                  </div>
                  <Textarea label="Awards & Honours" name="awards" value={form.awards} onChange={handleChange} rows={3} />
                </div>
              )}

              {/* Save button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-8 py-3 rounded-xl bg-[#00342b] text-white font-bold text-sm hover:bg-[#00493c] transition disabled:opacity-60 flex items-center gap-2 shadow-sm"
                >
                  {saving && (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  )}
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </form>
          ) : (
            /* ── PASSWORD TAB ── */
            <form onSubmit={savePassword} className="bg-white border rounded-2xl p-6 shadow-sm space-y-5">
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  ["Current Password", "current_password"],
                  ["New Password", "new_password"],
                  ["Confirm New Password", "confirm_password"],
                ].map(([label, key]) => (
                  <div key={key} className="space-y-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</label>
                    <input
                      type="password"
                      className="w-full h-11 border border-gray-200 rounded-xl px-4 text-sm outline-none focus:ring-2 focus:ring-[#00342b] transition"
                      value={pwd[key]}
                      onChange={(e) => setPwd({ ...pwd, [key]: e.target.value })}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <button type="submit" className="px-8 py-3 rounded-xl bg-gray-800 text-white font-bold text-sm hover:bg-gray-900 transition shadow-sm">
                  Update Password
                </button>
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  );
}
