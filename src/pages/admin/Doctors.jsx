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

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    if (!Array.isArray(items)) return [];
    return items.filter((d) => {
      const q = search.trim().toLowerCase();
      const matchesSearch = !q || [d.name, d.doctor_id, d.specialty, d.email, d.phone, d.location, d.practice].some(
        v => String(v || "").toLowerCase().includes(q)
      );
      const matchesSpecialty = !specialty || d.specialty === specialty;
      const matchesStatus = !status || d.status === status;
      return matchesSearch && matchesSpecialty && matchesStatus;
    });
  }, [items, search, specialty, status]);

  // Build FormData — gallery field name must match what API expects: 'gallery[]'
  const buildFormData = ({ profileImage, galleryImages, ...form }) => {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v ?? ""));
    if (profileImage) fd.append("profile_image", profileImage);
    (galleryImages || []).forEach(file => fd.append("gallery[]", file));
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
    const newStatus = doctor.status === "verified" ? "inactive" : "verified";
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#00342b]">Doctor Management</h2>
            <p className="text-sm text-[#3f4945] mt-1">Create, update, verify, and delete doctor records</p>
          </div>
          <button onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#00342b] text-white font-semibold hover:bg-[#004d3d] transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
            </svg>
            Add New Doctor
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-[#e1e3e4] p-4 grid gap-3 md:grid-cols-4">
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search name / ID / email / phone / location..."
            className="border border-[#bfc9c4] rounded-xl px-4 py-3 md:col-span-2 text-sm focus:ring-2 focus:ring-[#00342b] outline-none" />
          <select value={specialty} onChange={e => setSpecialty(e.target.value)}
            className="border border-[#bfc9c4] rounded-xl px-4 py-3 bg-white text-sm">
            <option value="">All Specialties</option>
            {ALL_SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={status} onChange={e => setStatus(e.target.value)}
            className="border border-[#bfc9c4] rounded-xl px-4 py-3 bg-white text-sm">
            <option value="">All Status</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {/* Content */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-[#e1e3e4] p-10 text-center text-[#3f4945]">
            <svg className="w-8 h-8 animate-spin mx-auto mb-2 text-[#00342b]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Loading doctors...
          </div>
        ) : (
          <>
            <p className="text-sm text-[#707975]">
              Showing <span className="font-bold text-[#00342b]">{filtered.length}</span> of {items.length} doctors
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

      {/* Add Modal */}
      <DoctorFormModal open={showAdd} title="Add New Doctor" onClose={() => setShowAdd(false)} onSubmit={submitAdd} />

      {/* Edit Modal */}
      <DoctorFormModal open={!!editing} title="Edit Doctor" initialData={editing} onClose={() => setEditing(null)} onSubmit={submitEdit} />

      {/* View Modal — full detail */}
      {viewing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl my-4 overflow-hidden">
            {/* Header */}
            <div className="bg-[#00342b] px-6 py-5 flex items-start gap-4">
              <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white/30 bg-white/10 shrink-0">
                {(viewing.profile_image || viewing.image) ? (
                  <img src={viewing.profile_image || viewing.image} alt={viewing.name}
                    className="w-full h-full object-cover" onError={e => { e.target.style.display='none'; }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/40">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-white leading-tight">{viewing.name}</h3>
                {viewing.title && <p className="text-emerald-200 text-sm">{viewing.title}</p>}
                <p className="text-emerald-300 text-sm">{viewing.specialty}{viewing.subspecialty ? ` · ${viewing.subspecialty}` : ''}</p>
                <p className="text-emerald-400 text-xs mt-0.5 font-mono">{viewing.doctor_id}</p>
              </div>
              <button onClick={() => setViewing(null)} className="text-white/70 hover:text-white text-2xl leading-none shrink-0">×</button>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto max-h-[65vh]">
              {/* Badges */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                  viewing.status === "verified" ? "bg-green-100 text-green-700"
                  : viewing.status === "inactive" ? "bg-gray-100 text-gray-600"
                  : "bg-amber-100 text-amber-700"}`}>
                  {viewing.status || "pending"}
                </span>
                {(viewing.accepting_patients === 1 || viewing.accepting_patients === "1" || viewing.acceptingPatients) && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">Accepting Patients</span>
                )}
              </div>

              {/* Info grid */}
              <div className="grid md:grid-cols-2 gap-3 text-sm">
                <Info label="Email" value={viewing.email} />
                <Info label="Phone" value={viewing.phone} />
                <Info label="Gender" value={viewing.gender} />
                <Info label="Languages" value={Array.isArray(viewing.languages) ? viewing.languages.join(", ") : viewing.languages} />
                <Info label="Experience" value={viewing.experience} />
                <Info label="Education" value={viewing.education} />
                <Info label="Degree" value={viewing.degree || viewing.graduation_degree} />
                <Info label="Year Graduated" value={viewing.year_graduated || viewing.graduation_year} />
                <Info label="Academic Title" value={viewing.academic_title} />
                <Info label="Academic Affiliation" value={viewing.academic_affiliation} />
                <Info label="Medical School Attended" value={viewing.medical_school_attended || viewing.medical_school_affiliation} />
                <Info label="Practice" value={viewing.practice} />
                <Info label="Location" value={viewing.location} full />
                <Info label="Address" value={viewing.address} full />
                <Info label="Hospital Affiliations" value={viewing.hospital_affiliations} full />
                <Info label="Awards" value={viewing.awards} full />
                <Info label="Bio" value={viewing.bio} full />
              </div>

              {/* Gallery */}
              {Array.isArray(viewing.gallery) && viewing.gallery.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-[#707975] mb-2">Gallery ({viewing.gallery.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {viewing.gallery.map((g, i) => (
                      <div key={g.id || i} className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border border-[#e1e3e4]">
                        <img src={g.image} alt={`Gallery ${i + 1}`} className="w-full h-full object-cover"
                          onError={e => { e.target.style.display='none'; }} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t border-[#e1e3e4] bg-gray-50">
              <button onClick={() => { const doc = viewing; setViewing(null); setEditing(doc); }}
                className="px-4 py-2 rounded-xl bg-[#00342b] text-white text-sm font-semibold hover:bg-[#004d3d] transition">
                Edit Doctor
              </button>
              <button onClick={() => setViewing(null)}
                className="px-4 py-2 rounded-xl border border-[#bfc9c4] text-sm text-[#3f4945] hover:bg-gray-100 transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      <ConfirmDeleteModal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title={`Delete "${deleting?.name || "this doctor"}" permanently? This cannot be undone.`}
      />
    </AdminLayout>
  );
}

function Info({ label, value, full = false }) {
  if (!value) return null;
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <div className="text-xs uppercase tracking-wider text-[#707975] font-semibold">{label}</div>
      <div className="mt-0.5 text-[#191c1d] text-sm">{value}</div>
    </div>
  );
}
