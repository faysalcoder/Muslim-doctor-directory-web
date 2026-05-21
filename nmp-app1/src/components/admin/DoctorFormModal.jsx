import React, { useEffect, useState } from 'react';

const emptyForm = {
  id: '',
  name: '',
  specialty: '',
  email: '',
  phone: '',
  location: '',
  experience: '',
  education: '',
  bio: '',
  status: 'pending',
};

export default function DoctorFormModal({ open, title, initialData, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm);
  const [profileImage, setProfileImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);

  useEffect(() => {
    if (initialData) {
      setForm({
        id: initialData.id || '',
        name: initialData.name || '',
        specialty: initialData.specialty || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        location: initialData.location || '',
        experience: initialData.experience || '',
        education: initialData.education || '',
        bio: initialData.bio || '',
        status: initialData.status || 'pending',
      });
    } else {
      setForm(emptyForm);
    }
    setProfileImage(null);
    setGalleryImages([]);
  }, [initialData, open]);

  if (!open) return null;

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, profileImage, galleryImages });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
      <form onSubmit={handleSubmit} className="w-full max-w-4xl bg-white rounded-2xl shadow-xl p-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-[#00342b]">{title}</h3>
            <p className="text-sm text-[#3f4945]">Create or update physician details</p>
          </div>
          <button type="button" onClick={onClose} className="text-3xl leading-none text-[#3f4945]">×</button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Full Name" value={form.name} onChange={(v) => setField('name', v)} placeholder="Dr. Jane Smith" />
          <Field label="Specialty" value={form.specialty} onChange={(v) => setField('specialty', v)} placeholder="Cardiology" />
          <Field label="Email" value={form.email} onChange={(v) => setField('email', v)} placeholder="doctor@mednetwork.com" />
          <Field label="Phone" value={form.phone} onChange={(v) => setField('phone', v)} placeholder="+1 555 000 0000" />
          <Field label="Location / Clinic" value={form.location} onChange={(v) => setField('location', v)} placeholder="Hospital / Clinic" className="md:col-span-2" />
          <Field label="Experience" value={form.experience} onChange={(v) => setField('experience', v)} placeholder="10+ years" />
          <Field label="Education" value={form.education} onChange={(v) => setField('education', v)} placeholder="MBBS, FCPS" />
          <div>
            <label className="block text-sm font-semibold text-[#3f4945] mb-1">Status</label>
            <select value={form.status} onChange={(e) => setField('status', e.target.value)} className="w-full border border-[#bfc9c4] rounded-xl px-4 py-3 bg-white">
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-[#3f4945] mb-1">Bio</label>
            <textarea value={form.bio} onChange={(e) => setField('bio', e.target.value)} rows={4} className="w-full border border-[#bfc9c4] rounded-xl px-4 py-3 bg-white" placeholder="Short profile bio" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#3f4945] mb-1">Profile Image</label>
            <input type="file" accept="image/*" onChange={(e) => setProfileImage(e.target.files?.[0] || null)} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#3f4945] mb-1">Gallery Images</label>
            <input type="file" accept="image/*" multiple onChange={(e) => setGalleryImages(Array.from(e.target.files || []))} />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-[#bfc9c4] text-[#3f4945]">Cancel</button>
          <button type="submit" className="px-5 py-2 rounded-xl bg-[#00342b] text-white font-semibold">Save Doctor</button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, className = '' }) {
  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-[#3f4945] mb-1">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="w-full border border-[#bfc9c4] rounded-xl px-4 py-3 bg-white" />
    </div>
  );
}
