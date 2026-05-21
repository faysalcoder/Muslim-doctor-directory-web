import React, { useEffect, useMemo, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import DoctorTable from "../../components/admin/DoctorTable";
import DoctorFormModal from "../../components/admin/DoctorFormModal";
import ConfirmDeleteModal from "../../components/admin/ConfirmDeleteModal";
import {
  createDoctor,
  deleteDoctor,
  getDoctors,
  updateDoctor,
} from "../../api/axios";

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

  const load = async () => {
    setLoading(true);
    const res = await getDoctors();
    setItems(res?.data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(
    () =>
      items.filter((d) => {
        const q = search.trim().toLowerCase();
        const matchesSearch =
          !q ||
          [d.name, d.doctor_id, d.specialty, d.email].some((v) =>
            String(v || "")
              .toLowerCase()
              .includes(q),
          );
        const matchesSpecialty = !specialty || d.specialty === specialty;
        const matchesStatus = !status || d.status === status;
        return matchesSearch && matchesSpecialty && matchesStatus;
      }),
    [items, search, specialty, status],
  );

  const submitAdd = async ({ profileImage, galleryImages, ...form }) => {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v ?? ""));
    if (profileImage) fd.append("profile_image", profileImage);
    galleryImages.forEach((file) => fd.append("gallery[]", file));
    const res = await createDoctor(fd);
    if (res?.success) {
      setShowAdd(false);
      load();
    } else alert(res?.message || "Failed to add doctor");
  };

  const submitEdit = async ({ profileImage, galleryImages, ...form }) => {
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v ?? ""));
    if (profileImage) fd.append("profile_image", profileImage);
    galleryImages.forEach((file) => fd.append("gallery[]", file));
    const res = await updateDoctor(fd);
    if (res?.success) {
      setEditing(null);
      load();
    } else alert(res?.message || "Failed to update doctor");
  };

  const handleDelete = async () => {
    const res = await deleteDoctor(deleting.id);
    if (res?.success) {
      setDeleting(null);
      load();
    } else alert(res?.message || "Failed to delete doctor");
  };

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
            className="px-5 py-3 rounded-xl bg-[#00342b] text-white font-semibold"
          >
            Add New Doctor
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-[#e1e3e4] p-4 grid gap-3 md:grid-cols-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name / ID / email"
            className="border border-[#bfc9c4] rounded-xl px-4 py-3 md:col-span-2"
          />
          <select
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            className="border border-[#bfc9c4] rounded-xl px-4 py-3 bg-white"
          >
            <option value="">All Specialties</option>
            <option value="Neurology">Neurology</option>
            <option value="Pediatrics">Pediatrics</option>
            <option value="Dermatology">Dermatology</option>
            <option value="Orthopedics">Orthopedics</option>
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-[#bfc9c4] rounded-xl px-4 py-3 bg-white"
          >
            <option value="">All Status</option>
            <option value="verified">Verified</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {loading ? (
          <div className="text-[#3f4945]">Loading doctors...</div>
        ) : (
          <DoctorTable
            doctors={filtered}
            onView={setViewing}
            onEdit={setEditing}
            onDelete={setDeleting}
          />
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

      {viewing ? (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-[#00342b]">
                  {viewing.name}
                </h3>
                <p className="text-sm text-[#3f4945]">{viewing.specialty}</p>
              </div>
              <button
                onClick={() => setViewing(null)}
                className="text-3xl leading-none text-[#3f4945]"
              >
                ×
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-3 text-sm text-[#3f4945]">
              <Info label="Doctor ID" value={viewing.doctor_id} />
              <Info label="Status" value={viewing.status} />
              <Info label="Email" value={viewing.email} />
              <Info label="Phone" value={viewing.phone} />
              <Info label="Location" value={viewing.location} full />
              <Info label="Experience" value={viewing.experience} full />
              <Info label="Education" value={viewing.education} full />
              <Info label="Bio" value={viewing.bio} full />
            </div>
          </div>
        </div>
      ) : null}

      <ConfirmDeleteModal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title={`Delete ${deleting?.name || "this doctor"} permanently?`}
      />
    </AdminLayout>
  );
}

function Info({ label, value, full = false }) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <div className="text-xs uppercase tracking-wider text-[#707975] font-semibold">
        {label}
      </div>
      <div className="mt-1 text-[#191c1d]">{value || "—"}</div>
    </div>
  );
}
