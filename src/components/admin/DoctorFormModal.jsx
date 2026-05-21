import React, { useEffect, useState } from 'react';
import { removeDoctorImage, resolveGalleryImageUrl } from '../../api/axios';
import toast from 'react-hot-toast';

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

const emptyForm = {
  id: '',
  name: '', title: '', academic_title: '', academic_affiliation: '', specialty: '', subspecialty: '',
  graduation_degree: '', graduation_year: '', medical_school_affiliation: '',
  experience: '', education: '', gender: '', languages: '',
  email: '', phone: '', location: '', practice: '', address: '',
  hospital_affiliations: '', awards: '', bio: '',
  status: 'pending', accepting_patients: '0',
};

export default function DoctorFormModal({ open, title, initialData, onClose, onSubmit }) {
  const [form, setForm] = useState(emptyForm);
  const [profileImage, setProfileImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [existingGallery, setExistingGallery] = useState([]); // [{id, image (resolved url)}]
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (!open) return;
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
        gender: initialData.gender || '',
        languages: Array.isArray(initialData.languages)
          ? initialData.languages.join(', ')
          : (initialData.languages || ''),
        title: initialData.title || '',
        academic_title: initialData.academic_title || '',
        academic_affiliation: initialData.academic_affiliation || initialData.academicAffiliation || '',
        medical_school_affiliation: initialData.medical_school_affiliation || '',
        subspecialty: initialData.subspecialty || '',
        graduation_degree: initialData.graduation_degree || '',
        graduation_year: initialData.graduation_year ? String(initialData.graduation_year) : '',
        practice: initialData.practice || '',
        address: initialData.address || '',
        hospital_affiliations: initialData.hospital_affiliations || '',
        awards: initialData.awards || '',
        accepting_patients: (initialData.accepting_patients === 1 || initialData.accepting_patients === '1' || initialData.acceptingPatients) ? '1' : '0',
      });
      setProfilePreview(initialData.profile_image || initialData.image || null);
      // Existing gallery — already resolved by normaliseApiDoctor
      setExistingGallery(
        (initialData.gallery || []).map(g => ({
          id: g.id,
          image: g.image || resolveGalleryImageUrl(g.image),
        }))
      );
    } else {
      setForm(emptyForm);
      setProfilePreview(null);
      setExistingGallery([]);
    }
    setProfileImage(null);
    setGalleryImages([]);
    setGalleryPreviews([]);
    setSubmitting(false);
    setStep(1);
  }, [initialData, open]);

  if (!open) return null;

  const setField = (key, value) => setForm(prev => ({ ...prev, [key]: value }));

  const handleProfileImage = e => {
    const file = e.target.files?.[0] || null;
    setProfileImage(file);
    if (file) setProfilePreview(URL.createObjectURL(file));
  };

  const handleGalleryImages = e => {
    const files = Array.from(e.target.files || []);
    setGalleryImages(prev => [...prev, ...files]);
    const urls = files.map(f => URL.createObjectURL(f));
    setGalleryPreviews(prev => [...prev, ...urls]);
  };

  const removeNewGalleryImage = idx => {
    setGalleryImages(prev => prev.filter((_, i) => i !== idx));
    setGalleryPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const removeExistingGalleryImage = async (imgId) => {
    try {
      const res = await removeDoctorImage(imgId);
      if (res?.success) {
        setExistingGallery(prev => prev.filter(g => g.id !== imgId));
        toast.success('Image removed');
      } else {
        toast.error(res?.message || 'Failed to remove image');
      }
    } catch {
      toast.error('Failed to remove image');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({ ...form, profileImage, galleryImages });
    } finally {
      setSubmitting(false);
    }
  };

  const totalSteps = 4;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl my-8 overflow-hidden">
        {/* Header */}
        <div className="bg-[#00342b] px-6 py-5 flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">{title}</h3>
            <p className="text-sm text-emerald-200 mt-0.5">Step {step} of {totalSteps}</p>
          </div>
          <button type="button" onClick={onClose} className="text-white/70 hover:text-white text-2xl leading-none mt-0.5">×</button>
        </div>

        {/* Step tabs */}
        <div className="flex border-b border-[#e1e3e4]">
          {['Basic Info', 'Contact', 'Medical', 'Images & Status'].map((label, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setStep(i + 1)}
              className={`flex-1 py-3 text-xs font-semibold transition ${step === i + 1 ? 'text-[#00342b] border-b-2 border-[#00342b] bg-emerald-50' : 'text-[#707975] hover:text-[#00342b]'}`}
            >
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-4">
              <SectionLabel>Basic Information</SectionLabel>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Full Name *" value={form.name} onChange={v => setField('name', v)} placeholder="Dr. Jane Smith" required />
                <SelectField label="Specialty *" value={form.specialty} onChange={v => setField('specialty', v)} required>
                  <option value="">Select specialty...</option>
                  {ALL_SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
                </SelectField>
                <Field label="Subspecialty" value={form.subspecialty} onChange={v => setField('subspecialty', v)} placeholder="e.g. Interventional Cardiology" />
                <Field label="Title / Credentials" value={form.title} onChange={v => setField('title', v)} placeholder="MD, FACC, FRCP" />
                <Field label="Academic Title" value={form.academic_title} onChange={v => setField('academic_title', v)} placeholder="Professor, Associate Professor..." />
                <Field label="Academic Affiliation" value={form.academic_affiliation} onChange={v => setField('academic_affiliation', v)} placeholder="Department of Cardiology, XYZ University" />
                <Field label="Medical School Attended" value={form.medical_school_affiliation} onChange={v => setField('medical_school_affiliation', v)} placeholder="Harvard Medical School" />
                <Field label="Graduation Degree" value={form.graduation_degree} onChange={v => setField('graduation_degree', v)} placeholder="MBBS, MD, DO..." />
                <Field label="Graduation Year" value={form.graduation_year} onChange={v => setField('graduation_year', v)} placeholder="2005" type="number" />
                <Field label="Years of Experience" value={form.experience} onChange={v => setField('experience', v)} placeholder="10+ years" />
                <Field label="Education Summary" value={form.education} onChange={v => setField('education', v)} placeholder="MBBS, FCPS — combined degrees/certs" />
                <SelectField label="Gender" value={form.gender} onChange={v => setField('gender', v)}>
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </SelectField>
                <Field label="Languages (comma separated)" value={form.languages} onChange={v => setField('languages', v)} placeholder="English, Arabic, Urdu" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#3f4945] mb-1">Bio / About</label>
                <textarea value={form.bio} onChange={e => setField('bio', e.target.value)} rows={4}
                  className="w-full border border-[#bfc9c4] rounded-xl px-4 py-3 bg-white text-sm focus:ring-2 focus:ring-[#00342b] outline-none"
                  placeholder="Short profile bio describing the doctor's background..." />
              </div>
            </div>
          )}

          {/* Step 2: Contact & Location */}
          {step === 2 && (
            <div className="space-y-4">
              <SectionLabel>Contact & Location</SectionLabel>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Email" value={form.email} onChange={v => setField('email', v)} placeholder="doctor@example.com" type="email" />
                <Field label="Phone" value={form.phone} onChange={v => setField('phone', v)} placeholder="+1 555 000 0000" />
                <Field label="Practice / Clinic Name" value={form.practice} onChange={v => setField('practice', v)} placeholder="Community Health Clinic" />
                <Field label="City / Location" value={form.location} onChange={v => setField('location', v)} placeholder="Dhaka, Bangladesh" />
                <Field label="Full Address" value={form.address} onChange={v => setField('address', v)} placeholder="123 Main St, City, Country" className="md:col-span-2" />
              </div>
            </div>
          )}

          {/* Step 3: Medical / Hospital */}
          {step === 3 && (
            <div className="space-y-4">
              <SectionLabel>Hospital Affiliations & Awards</SectionLabel>
              <div className="grid gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#3f4945] mb-1">Hospital Affiliations</label>
                  <textarea value={form.hospital_affiliations} onChange={e => setField('hospital_affiliations', e.target.value)} rows={3}
                    className="w-full border border-[#bfc9c4] rounded-xl px-4 py-3 bg-white text-sm focus:ring-2 focus:ring-[#00342b] outline-none"
                    placeholder="Hospital 1 | Hospital 2 | Hospital 3" />
                  <p className="text-xs text-[#707975] mt-1">Separate multiple hospitals with " | "</p>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#3f4945] mb-1">Awards & Recognitions</label>
                  <textarea value={form.awards} onChange={e => setField('awards', e.target.value)} rows={3}
                    className="w-full border border-[#bfc9c4] rounded-xl px-4 py-3 bg-white text-sm focus:ring-2 focus:ring-[#00342b] outline-none"
                    placeholder="Best Cardiologist 2022, AHA Fellow..." />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Images & Status */}
          {step === 4 && (
            <div className="space-y-5">
              <SectionLabel>Status & Availability</SectionLabel>
              <div className="grid md:grid-cols-2 gap-4">
                <SelectField label="Status" value={form.status} onChange={v => setField('status', v)}>
                  <option value="verified">Verified</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                </SelectField>
                <div className="flex items-center gap-3 pt-6">
                  <input type="checkbox" id="accepting_patients"
                    checked={form.accepting_patients === '1'}
                    onChange={e => setField('accepting_patients', e.target.checked ? '1' : '0')}
                    className="w-5 h-5 accent-[#00342b]" />
                  <label htmlFor="accepting_patients" className="text-sm font-semibold text-[#3f4945] cursor-pointer">
                    Currently Accepting Patients
                  </label>
                </div>
              </div>

              <SectionLabel>Images</SectionLabel>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Profile Image */}
                <div>
                  <label className="block text-sm font-semibold text-[#3f4945] mb-2">Profile Image</label>
                  {profilePreview && (
                    <div className="mb-3 relative w-24 h-24 rounded-xl overflow-hidden border border-[#bfc9c4] bg-gray-100">
                      <img src={profilePreview} alt="Profile preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => { setProfileImage(null); setProfilePreview(null); }}
                        className="absolute top-1 right-1 bg-white rounded-full w-5 h-5 text-xs text-red-600 font-bold shadow flex items-center justify-center">
                        ×
                      </button>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={handleProfileImage}
                    className="text-sm text-[#3f4945] file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#00342b]/10 file:text-[#00342b] file:font-semibold file:cursor-pointer" />
                  <p className="text-xs text-[#707975] mt-1">JPG, PNG, WebP — max 5MB</p>
                </div>

                {/* Gallery Images */}
                <div>
                  <label className="block text-sm font-semibold text-[#3f4945] mb-2">Gallery Images</label>

                  {/* Existing gallery with delete */}
                  {existingGallery.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs text-[#707975] mb-1">Existing ({existingGallery.length})</p>
                      <div className="flex flex-wrap gap-2">
                        {existingGallery.map(g => (
                          <div key={g.id} className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#bfc9c4] bg-gray-100">
                            <img src={g.image} alt="Gallery" className="w-full h-full object-cover"
                              onError={e => { e.target.style.display='none'; }} />
                            <button type="button" onClick={() => removeExistingGalleryImage(g.id)}
                              className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center shadow">
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* New gallery previews */}
                  {galleryPreviews.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs text-[#707975] mb-1">New to upload ({galleryPreviews.length})</p>
                      <div className="flex flex-wrap gap-2">
                        {galleryPreviews.map((url, i) => (
                          <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-[#bfc9c4] bg-gray-100">
                            <img src={url} alt={`New ${i + 1}`} className="w-full h-full object-cover" />
                            <button type="button" onClick={() => removeNewGalleryImage(i)}
                              className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center shadow">
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <input type="file" accept="image/*" multiple onChange={handleGalleryImages}
                    className="text-sm text-[#3f4945] file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#00342b]/10 file:text-[#00342b] file:font-semibold file:cursor-pointer" />
                  <p className="text-xs text-[#707975] mt-1">Select multiple — appended to existing gallery</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center pt-4 border-t border-[#e1e3e4]">
            <button type="button" onClick={() => step > 1 ? setStep(step - 1) : onClose()}
              className="px-4 py-2 rounded-xl border border-[#bfc9c4] text-[#3f4945] text-sm disabled:opacity-50">
              {step > 1 ? '← Back' : 'Cancel'}
            </button>

            <div className="flex gap-3">
              {step < totalSteps ? (
                <button type="button" onClick={() => setStep(step + 1)}
                  className="px-5 py-2 rounded-xl bg-[#00342b] text-white font-semibold text-sm">
                  Next →
                </button>
              ) : (
                <button type="submit" disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-[#00342b] text-white font-semibold text-sm disabled:opacity-60 flex items-center gap-2">
                  {submitting && (
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                  )}
                  {submitting ? 'Saving...' : 'Save Doctor'}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return <p className="text-xs font-bold uppercase tracking-widest text-[#707975]">{children}</p>;
}

function Field({ label, value, onChange, placeholder, className = '', type = 'text', required = false }) {
  return (
    <div className={className}>
      <label className="block text-sm font-semibold text-[#3f4945] mb-1">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required}
        className="w-full border border-[#bfc9c4] rounded-xl px-4 py-3 bg-white text-sm focus:ring-2 focus:ring-[#00342b] focus:border-[#00342b] outline-none" />
    </div>
  );
}

function SelectField({ label, value, onChange, children, required = false }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#3f4945] mb-1">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)} required={required}
        className="w-full border border-[#bfc9c4] rounded-xl px-4 py-3 bg-white text-sm focus:ring-2 focus:ring-[#00342b] outline-none">
        {children}
      </select>
    </div>
  );
}
