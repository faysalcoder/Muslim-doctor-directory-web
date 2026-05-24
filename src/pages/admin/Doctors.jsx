import React, { useEffect, useMemo, useState, useCallback } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import DoctorTable from "../../components/admin/DoctorTable";
import DoctorFormModal from "../../components/admin/DoctorFormModal";
import ConfirmDeleteModal from "../../components/admin/ConfirmDeleteModal";
import toast from "react-hot-toast";
import {
  createDoctor,
  deleteDoctor,
  getDoctors,
  toggleDoctorStatus,
  updateDoctor,
} from "../../api/axios";

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

function isTruthyValue(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === "string" && value.trim() === "") return false;
  if (Array.isArray(value) && value.length === 0) return false;
  return true;
}

function formatValue(value) {
  if (!isTruthyValue(value)) return null;
  if (Array.isArray(value)) {
    const items = value
      .map((item) => {
        if (typeof item === "string") return item.trim();
        if (item && typeof item === "object") {
          return (
            item.name ||
            item.title ||
            item.label ||
            item.value ||
            item.image ||
            JSON.stringify(item)
          );
        }
        return String(item);
      })
      .filter(Boolean);
    return items.length ? items.join(", ") : null;
  }
  if (typeof value === "object") {
    if (value.name || value.title || value.label || value.value) {
      return value.name || value.title || value.label || value.value;
    }
    return JSON.stringify(value);
  }
  return String(value);
}

function getDoctorImage(doctor) {
  return doctor?.profile_image || doctor?.image || doctor?.photo || "";
}

function getDoctorStatus(status) {
  const value = String(status || "pending").toLowerCase();
  if (value === "verified")
    return {
      label: "Verified",
      className: "bg-emerald-100 text-emerald-700 border-emerald-200",
    };
  if (value === "inactive")
    return {
      label: "Inactive",
      className: "bg-slate-100 text-slate-600 border-slate-200",
    };
  return {
    label: "Pending",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  };
}

function isAcceptingPatients(doctor) {
  return (
    doctor?.accepting_patients === 1 ||
    doctor?.accepting_patients === "1" ||
    doctor?.accepting_patients === true ||
    doctor?.acceptingPatients === true
  );
}

// Parse hospital affiliations string into array (split by |)
function parseHospitalList(val) {
  if (!val) return [];
  return val
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
}

function DetailItem({ label, value, full = false }) {
  const text = formatValue(value);
  if (!text) return null;
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <div className="text-[11px] uppercase tracking-[0.16em] text-[#6b7571] font-semibold mb-1">
        {label}
      </div>
      <div className="text-sm leading-6 text-[#1f2422] break-words whitespace-pre-line">
        {text}
      </div>
    </div>
  );
}

function SectionCard({ title, icon, children }) {
  return (
    <div className="rounded-2xl border border-[#e3e7e5] bg-white overflow-hidden">
      <div className="border-b border-[#e9ecea] px-4 py-3 flex items-center gap-2">
        {icon && <span className="text-[#00342b]">{icon}</span>}
        <h4 className="text-sm font-bold text-[#00342b]">{title}</h4>
      </div>
      <div className="px-4 py-4">{children}</div>
    </div>
  );
}

export default function Doctors() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [status, setStatus] = useState("");

  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  // Inline status change in view modal
  const [viewStatusChanging, setViewStatusChanging] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getDoctors();
      setItems(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to load doctors:", err);
      setItems([]);
      toast.error("Could not load doctors");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    if (!Array.isArray(items)) return [];
    return items.filter((d) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        [
          d.name,
          d.doctor_id,
          d.specialty,
          d.subspecialty,
          d.email,
          d.phone,
          d.location,
          d.practice,
          d.address,
          d.hospital_affiliations,
          d.academic_title,
          d.academic_affiliation,
          d.education,
        ].some((v) =>
          String(v || "")
            .toLowerCase()
            .includes(q),
        );
      const matchesSpecialty = !specialty || d.specialty === specialty;
      const matchesStatus =
        !status || String(d.status || "").toLowerCase() === status;
      return matchesSearch && matchesSpecialty && matchesStatus;
    });
  }, [items, search, specialty, status]);

  const buildFormData = ({ profileImage, galleryImages, ...form }) => {
    const fd = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item) => fd.append(key, item ?? ""));
      } else {
        fd.append(key, value ?? "");
      }
    });
    if (profileImage) fd.append("profile_image", profileImage);
    (galleryImages || []).forEach((file) => fd.append("gallery[]", file));
    return fd;
  };

  const submitAdd = async (data) => {
    try {
      const fd = buildFormData(data);
      const res = await createDoctor(fd);
      if (res?.success) {
        setShowAdd(false);
        toast.success("Doctor added successfully!");
        load();
      } else {
        toast.error(res?.message || "Failed to add doctor");
      }
    } catch (err) {
      toast.error(err?.message || "Failed to add doctor");
    }
  };

  const submitEdit = async (data) => {
    try {
      const fd = buildFormData(data);
      const res = await updateDoctor(fd);
      if (res?.success) {
        setEditing(null);
        toast.success("Doctor updated successfully!");
        load();
      } else {
        toast.error(res?.message || "Failed to update doctor");
      }
    } catch (err) {
      toast.error(err?.message || "Failed to update doctor");
    }
  };

  const handleDelete = async () => {
    try {
      const name = deleting?.name || "this doctor";
      const res = await deleteDoctor(deleting.id);
      if (res?.success) {
        setDeleting(null);
        toast.success(`"${name}" deleted`);
        load();
      } else {
        toast.error(res?.message || "Failed to delete doctor");
      }
    } catch (err) {
      toast.error(err?.message || "Failed to delete");
    }
  };

  const handleToggleStatus = async (doctor) => {
    const currentStatus = String(doctor.status || "pending").toLowerCase();
    const newStatus = currentStatus === "verified" ? "inactive" : "verified";
    try {
      const res = await toggleDoctorStatus(doctor.id, newStatus);
      if (res?.success) {
        toast.success(`Status updated to ${newStatus}`);
        load();
      } else {
        toast.error(res?.message || "Failed to update status");
      }
    } catch (err) {
      toast.error(err?.message || "Failed to update status");
    }
  };

  // Change status directly from the view modal via dropdown
  const handleViewStatusChange = async (newStatus) => {
    if (!viewing || viewStatusChanging) return;
    setViewStatusChanging(true);
    try {
      const res = await toggleDoctorStatus(viewing.id, newStatus);
      if (res?.success) {
        toast.success(`Status updated to ${newStatus}`);
        setViewing((prev) => ({ ...prev, status: newStatus }));
        load();
      } else {
        toast.error(res?.message || "Failed to update status");
      }
    } catch (err) {
      toast.error(err?.message || "Failed to update status");
    } finally {
      setViewStatusChanging(false);
    }
  };

  const statusInfo = viewing ? getDoctorStatus(viewing.status) : null;
  const imgSrc = viewing ? getDoctorImage(viewing) : "";

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#00342b]">
              Doctor Management
            </h2>
            <p className="text-sm text-[#3f4945] mt-1">
              Create, update, verify, and delete doctor records
            </p>
          </div>
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#00342b] text-white font-semibold hover:bg-[#004d3d] transition"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M12 4v16m8-8H4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
            Add New Doctor
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-[#e1e3e4] p-4 grid gap-3 md:grid-cols-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name / ID / email / phone / location..."
            className="border border-[#bfc9c4] rounded-xl px-4 py-3 md:col-span-2 text-sm focus:ring-2 focus:ring-[#00342b] outline-none"
          />
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="border border-[#bfc9c4] rounded-xl px-4 py-3 bg-white text-sm"
          >
            <option value="">All Specialties</option>
            {ALL_SPECIALTIES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          {/* Status filter as dropdown */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-[#bfc9c4] rounded-xl px-4 py-3 bg-white text-sm"
          >
            <option value="">All Status</option>
            <option value="verified">✅ Verified</option>
            <option value="pending">⏳ Pending</option>
            <option value="inactive">⛔ Inactive</option>
          </select>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-[#e1e3e4] p-10 text-center text-[#3f4945]">
            <svg
              className="w-8 h-8 animate-spin mx-auto mb-2 text-[#00342b]"
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
            Loading doctors...
          </div>
        ) : (
          <>
            <p className="text-sm text-[#707975]">
              Showing{" "}
              <span className="font-bold text-[#00342b]">
                {filtered.length}
              </span>{" "}
              of {items.length} doctors
            </p>
            <DoctorTable
              doctors={filtered}
              onView={setViewing}
              onEdit={setEditing}
              onDelete={setDeleting}
              onToggleStatus={handleToggleStatus}
            />
          </>
        )}
      </div>

      <DoctorFormModal
        open={showAdd}
        title="Add New Doctor"
        onClose={() => setShowAdd(false)}
        onSubmit={submitAdd}
      />
      <DoctorFormModal
        open={!!editing}
        title="Edit Doctor"
        initialData={editing}
        onClose={() => setEditing(null)}
        onSubmit={submitEdit}
      />

      {/* ── Doctor View Modal ────────────────────────────────────────────── */}
      {viewing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-5xl bg-[#f7f9f8] rounded-3xl shadow-2xl my-6 overflow-hidden border border-white">
            {/* Header */}
            <div className="bg-[#00342b] px-5 py-5 md:px-6">
              <div className="flex flex-col md:flex-row md:items-start gap-5">
                {/* Avatar */}
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl overflow-hidden border-2 border-white/20 bg-white/10 shrink-0 shadow-lg">
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={viewing.name || "Doctor"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/50">
                      <svg
                        className="w-10 h-10"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusInfo.className}`}
                    >
                      {statusInfo.label}
                    </span>
                    {isAcceptingPatients(viewing) && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-700 border border-sky-200">
                        Accepting Patients
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                    {viewing.name || "Unnamed Doctor"}
                  </h3>
                  <p className="text-emerald-100 mt-1 text-sm md:text-base">
                    {formatValue(viewing.title) || "Doctor Profile"}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-sm">
                    {viewing.specialty && (
                      <span className="px-3 py-1 rounded-full bg-white/10 text-white border border-white/15">
                        {viewing.specialty}
                      </span>
                    )}
                    {viewing.subspecialty && (
                      <span className="px-3 py-1 rounded-full bg-white/10 text-white border border-white/15">
                        {viewing.subspecialty}
                      </span>
                    )}
                    {viewing.doctor_id && (
                      <span className="px-3 py-1 rounded-full bg-white/10 text-white/90 border border-white/15 font-mono text-xs">
                        {viewing.doctor_id}
                      </span>
                    )}
                  </div>
                </div>

                {/* Status dropdown in header */}
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <button
                    onClick={() => setViewing(null)}
                    className="text-white/80 hover:text-white text-3xl leading-none"
                    aria-label="Close"
                  >
                    ×
                  </button>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-emerald-200 font-semibold whitespace-nowrap">
                      Change Status:
                    </label>
                    <select
                      value={viewing.status || "pending"}
                      onChange={(e) => handleViewStatusChange(e.target.value)}
                      disabled={viewStatusChanging}
                      className="text-xs rounded-lg px-2 py-1.5 bg-white/10 text-white border border-white/20 focus:outline-none focus:ring-1 focus:ring-white/40 disabled:opacity-60"
                    >
                      <option value="verified" className="text-[#1f2422]">
                        ✅ Verified
                      </option>
                      <option value="pending" className="text-[#1f2422]">
                        ⏳ Pending
                      </option>
                      <option value="inactive" className="text-[#1f2422]">
                        ⛔ Inactive
                      </option>
                    </select>
                    {viewStatusChanging && (
                      <svg
                        className="w-4 h-4 animate-spin text-white"
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
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-4 md:p-6 space-y-4 overflow-y-auto max-h-[72vh]">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Personal Information */}
                <SectionCard title="Personal Information" icon="👤">
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <DetailItem label="Full Name" value={viewing.name} />
                    <DetailItem label="Doctor ID" value={viewing.doctor_id} />
                    <DetailItem label="Gender" value={viewing.gender} />
                    <DetailItem
                      label="Languages Spoken"
                      value={viewing.languages}
                    />
                    <DetailItem
                      label="Years of Experience"
                      value={viewing.experience}
                    />
                    <DetailItem
                      label="Accepting Patients"
                      value={isAcceptingPatients(viewing) ? "✅ Yes" : "❌ No"}
                    />
                  </div>
                </SectionCard>

                {/* Credentials & Title */}
                <SectionCard title="Credentials & Title" icon="🎓">
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <DetailItem
                      label="Medical Title / Credentials"
                      value={viewing.title}
                    />
                    <DetailItem
                      label="Academic Title"
                      value={viewing.academic_title}
                    />
                    <DetailItem
                      label="Academic Affiliation"
                      value={
                        viewing.academic_affiliation ||
                        viewing.academicAffiliation
                      }
                    />
                    <DetailItem
                      label="Medical School Attended"
                      value={
                        viewing.medical_school_attended ||
                        viewing.medical_school_affiliation
                      }
                      full
                    />
                  </div>
                </SectionCard>

                {/* Education */}
                <SectionCard title="Education" icon="📚">
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <DetailItem
                      label="Graduation Degree"
                      value={viewing.degree || viewing.graduation_degree}
                    />
                    <DetailItem
                      label="Graduation Year"
                      value={viewing.year_graduated || viewing.graduation_year}
                    />
                    <DetailItem
                      label="Education Summary"
                      value={viewing.education}
                      full
                    />
                  </div>
                </SectionCard>

                {/* Specialty */}
                <SectionCard title="Specialty" icon="🩺">
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <DetailItem
                      label="Primary Specialty"
                      value={viewing.specialty}
                    />
                    <DetailItem
                      label="Subspecialty"
                      value={viewing.subspecialty}
                    />
                  </div>
                </SectionCard>

                {/* Hospital Affiliations */}
                <SectionCard title="Hospital Affiliations" icon="🏥">
                  {(() => {
                    const hospitals = parseHospitalList(
                      viewing.hospital_affiliations,
                    );
                    if (!hospitals.length)
                      return (
                        <p className="text-sm text-[#a0aba5] italic">
                          No affiliations listed
                        </p>
                      );
                    return (
                      <div className="space-y-2">
                        {hospitals.map((h, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-sm text-[#1f2422]"
                          >
                            <span className="w-5 h-5 rounded-full bg-[#00342b]/10 text-[#00342b] text-xs font-bold flex items-center justify-center shrink-0">
                              {i + 1}
                            </span>
                            {h}
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </SectionCard>

                {/* Practice & Contact */}
                <SectionCard title="Practice & Contact" icon="📞">
                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <DetailItem
                      label="Clinic / Practice Name"
                      value={viewing.practice}
                    />
                    <DetailItem
                      label="City / Location"
                      value={viewing.location}
                    />
                    <DetailItem label="Email Address" value={viewing.email} />
                    <DetailItem label="Phone Number" value={viewing.phone} />
                    <DetailItem
                      label="Full Practice Address"
                      value={viewing.address}
                      full
                    />
                  </div>
                </SectionCard>

                {/* Awards */}
                <SectionCard title="Awards & Recognitions" icon="🏆">
                  <div className="text-sm">
                    <DetailItem label="Awards" value={viewing.awards} full />
                    {!isTruthyValue(viewing.awards) && (
                      <p className="text-sm text-[#a0aba5] italic">
                        No awards listed
                      </p>
                    )}
                  </div>
                </SectionCard>

                {/* Bio */}
                <SectionCard title="About / Bio" icon="📝">
                  <div className="text-sm">
                    <DetailItem label="Biography" value={viewing.bio} full />
                    {!isTruthyValue(viewing.bio) && (
                      <p className="text-sm text-[#a0aba5] italic">
                        No bio provided
                      </p>
                    )}
                  </div>
                </SectionCard>

                {/* Images */}
                <SectionCard title="Profile & Gallery" icon="🖼️">
                  <div className="space-y-4">
                    {imgSrc ? (
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.16em] text-[#6b7571] font-semibold mb-2">
                          Profile Photo
                        </div>
                        <img
                          src={imgSrc}
                          alt="Profile"
                          className="w-20 h-20 rounded-xl object-cover border border-[#e3e7e5]"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    ) : (
                      <p className="text-sm text-[#a0aba5] italic">
                        No profile photo
                      </p>
                    )}
                    {Array.isArray(viewing.gallery) &&
                    viewing.gallery.length > 0 ? (
                      <div>
                        <div className="text-[11px] uppercase tracking-[0.16em] text-[#6b7571] font-semibold mb-2">
                          Gallery ({viewing.gallery.length})
                        </div>
                        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                          {viewing.gallery.map((g, i) => {
                            const src = g?.image || g?.url || g?.src || "";
                            return (
                              <div
                                key={g?.id || i}
                                className="aspect-square rounded-xl overflow-hidden border border-[#e3e7e5] bg-gray-100"
                              >
                                {src ? (
                                  <img
                                    src={src}
                                    alt={`Gallery ${i + 1}`}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                    }}
                                  />
                                ) : null}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : null}
                  </div>
                </SectionCard>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 px-4 md:px-6 py-4 border-t border-[#e1e3e4] bg-white">
              <button
                onClick={() => {
                  const doc = viewing;
                  setViewing(null);
                  setEditing(doc);
                }}
                className="px-4 py-2.5 rounded-xl bg-[#00342b] text-white text-sm font-semibold hover:bg-[#004d3d] transition"
              >
                Edit Doctor
              </button>
              <button
                onClick={() => setViewing(null)}
                className="px-4 py-2.5 rounded-xl border border-[#bfc9c4] text-sm text-[#3f4945] hover:bg-gray-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title={`Delete "${deleting?.name || "this doctor"}" permanently? This cannot be undone.`}
      />
    </AdminLayout>
  );
}
