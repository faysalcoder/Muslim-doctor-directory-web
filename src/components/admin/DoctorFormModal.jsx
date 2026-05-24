import React, { useEffect, useState } from 'react';
import { removeDoctorImage, resolveGalleryImageUrl, registerMember, adminResetUserPassword } from '../../api/axios';
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

// Parse address string back into parts: "Street, City, State ZIP, County"
function parseAddress(addr) {
  if (!addr) return { street: '', city: '', state: '', zip: '', county: '' };
  // Try to split by comma segments
  const parts = addr.split('|').map(s => s.trim());
  return {
    street:  parts[0] || '',
    city:    parts[1] || '',
    state:   parts[2] || '',
    zip:     parts[3] || '',
    county:  parts[4] || '',
  };
}

function buildAddress({ street, city, state, zip, county }) {
  return [street, city, state, zip, county].filter(Boolean).join(' | ');
}

// Parse hospital affiliations string back to 4 fields
function parseHospitals(val) {
  const parts = (val || '').split('|').map(s => s.trim());
  return [parts[0] || '', parts[1] || '', parts[2] || '', parts[3] || ''];
}

function buildHospitals(arr) {
  return arr.filter(Boolean).join(' | ');
}

const emptyForm = {
  id: '',
  name: '', title: '', academic_title: '', academic_affiliation: '', specialty: '', subspecialty: '',
  graduation_degree: '', graduation_year: '', medical_school_affiliation: '',
  experience: '', education: '', gender: '', languages: '',
  email: '', phone: '', location: '', practice: '',
  // Address parts
  street: '', city: '', state: '', zip: '', county: '',
  address: '',
  // Hospital affiliations as 4 fields
  hospital_1: '', hospital_2: '', hospital_3: '', hospital_4: '',
  hospital_affiliations: '',
  awards: '', bio: '',
  status: 'pending', accepting_patients: '0',
};

export default function DoctorFormModal({ open, title, initialData, onClose, onSubmit }) {
  const isEdit = !!initialData?.id;

  const [form, setForm] = useState(emptyForm);
  const [profileImage, setProfileImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [existingGallery, setExistingGallery] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState(1);

  // Password fields for new doctor creation
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [createAccount, setCreateAccount] = useState(true);

  // Admin change-password modal (for existing doctors)
  const [showChangePw, setShowChangePw] = useState(false);
  const [newPw, setNewPw] = useState('');
  const [confirmNewPw, setConfirmNewPw] = useState('');
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmNewPw, setShowConfirmNewPw] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (initialData) {
      const addrParts = parseAddress(initialData.address || '');
      const hospitals = parseHospitals(initialData.hospital_affiliations || '');
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
        street: addrParts.street,
        city: addrParts.city,
        state: addrParts.state,
        zip: addrParts.zip,
        county: addrParts.county,
        hospital_1: hospitals[0],
        hospital_2: hospitals[1],
        hospital_3: hospitals[2],
        hospital_4: hospitals[3],
        hospital_affiliations: initialData.hospital_affiliations || '',
        awards: initialData.awards || '',
        accepting_patients: (initialData.accepting_patients === 1 || initialData.accepting_patients === '1' || initialData.acceptingPatients) ? '1' : '0',
      });
      setProfilePreview(initialData.profile_image || initialData.image || null);
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
    setPassword('');
    setConfirmPassword('');
    setCreateAccount(true);
    setShowChangePw(false);
    setNewPw('');
    setConfirmNewPw('');
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
    // Password validation for new doctors
    if (!isEdit && createAccount) {
      if (!password) { toast.error('Please enter a password for the doctor account.'); return; }
      if (password.length < 6) { toast.error('Password must be at least 6 characters.'); return; }
      if (password !== confirmPassword) { toast.error('Passwords do not match.'); return; }
    }
    setSubmitting(true);
    // Build combined address & hospital_affiliations before submit
    const combinedAddress = buildAddress({ street: form.street, city: form.city, state: form.state, zip: form.zip, county: form.county });
    const combinedHospitals = buildHospitals([form.hospital_1, form.hospital_2, form.hospital_3, form.hospital_4]);
    // Derive location from address city field
    const derivedLocation = form.city.trim() || form.location;
    try {
      await onSubmit({
        ...form,
        location: derivedLocation,
        address: combinedAddress,
        hospital_affiliations: combinedHospitals,
        profileImage,
        galleryImages,
      });
      // After doctor is created, also create their login account
      if (!isEdit && createAccount && form.email && password) {
        try {
          await registerMember({ name: form.name, email: form.email, password });
        } catch {
          // Doctor record saved; account creation failure is non-fatal
          toast('Doctor added, but account creation failed. The email may already be registered.', { icon: '⚠️' });
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleAdminChangePassword = async () => {
    if (!newPw) { toast.error('Please enter a new password.'); return; }
    if (newPw.length < 6) { toast.error('Password must be at least 6 characters.'); return; }
    if (newPw !== confirmNewPw) { toast.error('Passwords do not match.'); return; }
    setPwSaving(true);
    try {
      const res = await adminResetUserPassword(form.email, newPw);
      if (res?.success) {
        toast.success('Password updated successfully!');
        setShowChangePw(false);
        setNewPw('');
        setConfirmNewPw('');
      } else {
        toast.error(res?.message || 'Failed to update password. Make sure this doctor has an account.');
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to update password.');
    } finally {
      setPwSaving(false);
    }
  };

  const totalSteps = 4;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl my-8 overflow-hidden relative">
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
          {['Basic Info', 'Contact & Address', 'Hospital & Awards', 'Images & Status'].map((label, i) => (
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

          {/* Step 2: Contact & Address */}
          {step === 2 && (
            <div className="space-y-5">
              <SectionLabel>Contact Information</SectionLabel>
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Email" value={form.email} onChange={v => setField('email', v)} placeholder="doctor@example.com" type="email" />
                <Field label="Phone" value={form.phone} onChange={v => setField('phone', v)} placeholder="+1 555 000 0000" />
                <Field label="Practice / Clinic Name" value={form.practice} onChange={v => setField('practice', v)} placeholder="Community Health Clinic" className="md:col-span-2" />
              </div>

              <SectionLabel>Full Address</SectionLabel>
              <div className="bg-[#f8faf9] border border-[#e1e3e4] rounded-xl p-4 space-y-3">
                <p className="text-xs text-[#707975]">These fields will be combined and saved as the full address.</p>
                <div className="grid gap-3">
                  <Field
                    label="Street Address"
                    value={form.street}
                    onChange={v => setField('street', v)}
                    placeholder="123 Main Street, Suite 400"
                    className="w-full"
                  />
                  <div className="grid md:grid-cols-2 gap-3">
                    <Field label="City" value={form.city} onChange={v => setField('city', v)} placeholder="New York" />
                    <Field label="State / Province" value={form.state} onChange={v => setField('state', v)} placeholder="NY" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <Field label="ZIP / Postal Code" value={form.zip} onChange={v => setField('zip', v)} placeholder="10001" />
                    <Field
                      label={<>County <span className="text-[#a0aba5] font-normal">(optional)</span></>}
                      value={form.county}
                      onChange={v => setField('county', v)}
                      placeholder="Manhattan County"
                    />
                  </div>
                </div>
                {(form.street || form.city || form.state || form.zip) && (
                  <div className="mt-2 rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-2">
                    <p className="text-xs text-[#707975] mb-0.5 font-semibold uppercase tracking-wider">Preview</p>
                    <p className="text-sm text-[#00342b]">
                      {buildAddress({ street: form.street, city: form.city, state: form.state, zip: form.zip, county: form.county })}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Hospital & Awards */}
          {step === 3 && (
            <div className="space-y-5">
              <SectionLabel>Hospital Affiliations</SectionLabel>
              <div className="bg-[#f8faf9] border border-[#e1e3e4] rounded-xl p-4 space-y-3">
                <p className="text-xs text-[#707975]">Enter up to 4 hospital affiliations. Additional affiliations are optional.</p>
                <Field label="Hospital 1 *" value={form.hospital_1} onChange={v => setField('hospital_1', v)} placeholder="e.g. Mayo Clinic, Rochester MN" />
                <Field label={<>Hospital 2 <span className="text-[#a0aba5] font-normal">(optional)</span></>} value={form.hospital_2} onChange={v => setField('hospital_2', v)} placeholder="e.g. Johns Hopkins Hospital" />
                <Field label={<>Hospital 3 <span className="text-[#a0aba5] font-normal">(optional)</span></>} value={form.hospital_3} onChange={v => setField('hospital_3', v)} placeholder="e.g. Cleveland Clinic" />
                <Field label={<>Hospital 4 <span className="text-[#a0aba5] font-normal">(optional)</span></>} value={form.hospital_4} onChange={v => setField('hospital_4', v)} placeholder="e.g. Massachusetts General Hospital" />
                {(form.hospital_1 || form.hospital_2 || form.hospital_3 || form.hospital_4) && (
                  <div className="mt-1 rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-2">
                    <p className="text-xs text-[#707975] mb-0.5 font-semibold uppercase tracking-wider">Preview</p>
                    <p className="text-sm text-[#00342b]">
                      {buildHospitals([form.hospital_1, form.hospital_2, form.hospital_3, form.hospital_4])}
                    </p>
                  </div>
                )}
              </div>

              <SectionLabel>Awards & Recognitions</SectionLabel>
              <div>
                <textarea value={form.awards} onChange={e => setField('awards', e.target.value)} rows={3}
                  className="w-full border border-[#bfc9c4] rounded-xl px-4 py-3 bg-white text-sm focus:ring-2 focus:ring-[#00342b] outline-none"
                  placeholder="Best Cardiologist 2022, AHA Fellow..." />
              </div>
            </div>
          )}

          {/* Step 4: Images & Status */}
          {step === 4 && (
            <div className="space-y-5">
              <SectionLabel>Status & Availability</SectionLabel>
              <div className="grid md:grid-cols-2 gap-4">
                <SelectField label="Verification Status" value={form.status} onChange={v => setField('status', v)}>
                  <option value="verified">✅ Verified</option>
                  <option value="pending">⏳ Pending</option>
                  <option value="inactive">⛔ Inactive</option>
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
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => step > 1 ? setStep(step - 1) : onClose()}
                className="px-4 py-2 rounded-xl border border-[#bfc9c4] text-[#3f4945] text-sm disabled:opacity-50">
                {step > 1 ? '← Back' : 'Cancel'}
              </button>
              {/* Change Password button — only shown for existing doctors in step 4 */}
              {isEdit && step === totalSteps && form.email && (
                <button type="button" onClick={() => setShowChangePw(true)}
                  className="px-4 py-2 rounded-xl border border-amber-300 text-amber-700 bg-amber-50 text-sm font-semibold hover:bg-amber-100 transition flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  Change Password
                </button>
              )}
            </div>

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

          {/* Password fields for new doctor — shown inside step 4 (above images) */}
          {!isEdit && step === 4 && (
            <div className="border border-[#bfc9c4] rounded-2xl p-5 space-y-4 bg-[#f8faf9]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-[#00342b]">Create Login Account</p>
                  <p className="text-xs text-[#707975] mt-0.5">Allow this doctor to log in and manage their profile</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={createAccount} onChange={e => setCreateAccount(e.target.checked)} className="sr-only peer" />
                  <div className="w-10 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00342b]" />
                </label>
              </div>
              {createAccount && (
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#3f4945] mb-1">Password <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input type={showPassword ? 'text' : 'password'} value={password}
                        onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters"
                        className="w-full border border-[#bfc9c4] rounded-xl px-4 py-3 pr-11 bg-white text-sm focus:ring-2 focus:ring-[#00342b] outline-none" />
                      <button type="button" onClick={() => setShowPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showPassword
                          ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                          : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#3f4945] mb-1">Confirm Password <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input type={showConfirmPassword ? 'text' : 'password'} value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)} placeholder="Re-enter password"
                        className="w-full border border-[#bfc9c4] rounded-xl px-4 py-3 pr-11 bg-white text-sm focus:ring-2 focus:ring-[#00342b] outline-none" />
                      <button type="button" onClick={() => setShowConfirmPassword(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        {showConfirmPassword
                          ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                          : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
                      </button>
                    </div>
                  </div>
                  <p className="md:col-span-2 text-xs text-[#707975]">
                    The doctor will use their email (<span className="font-semibold text-[#00342b]">{form.email || 'set in step 2'}</span>) and this password to log in.
                  </p>
                </div>
              )}
            </div>
          )}
        </form>

        {/* Admin Change Password modal overlay */}
        {showChangePw && (
          <div className="absolute inset-0 z-10 bg-black/40 flex items-center justify-center p-4 rounded-2xl">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-base font-bold text-[#00342b]">Reset Doctor Password</h4>
                <button type="button" onClick={() => setShowChangePw(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-xs text-amber-800">
                Resetting password for: <span className="font-semibold">{form.email}</span>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-semibold text-[#3f4945] mb-1">New Password</label>
                  <div className="relative">
                    <input type={showNewPw ? 'text' : 'password'} value={newPw} onChange={e => setNewPw(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="w-full border border-[#bfc9c4] rounded-xl px-4 py-3 pr-11 bg-white text-sm focus:ring-2 focus:ring-[#00342b] outline-none" />
                    <button type="button" onClick={() => setShowNewPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showNewPw
                        ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                        : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#3f4945] mb-1">Confirm New Password</label>
                  <div className="relative">
                    <input type={showConfirmNewPw ? 'text' : 'password'} value={confirmNewPw} onChange={e => setConfirmNewPw(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full border border-[#bfc9c4] rounded-xl px-4 py-3 pr-11 bg-white text-sm focus:ring-2 focus:ring-[#00342b] outline-none" />
                    <button type="button" onClick={() => setShowConfirmNewPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showConfirmNewPw
                        ? <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                        : <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowChangePw(false)}
                  className="flex-1 py-2.5 rounded-xl border border-[#bfc9c4] text-[#3f4945] text-sm font-medium hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button type="button" onClick={handleAdminChangePassword} disabled={pwSaving}
                  className="flex-1 py-2.5 rounded-xl bg-[#00342b] text-white text-sm font-semibold hover:bg-[#004d3d] transition disabled:opacity-60 flex items-center justify-center gap-2">
                  {pwSaving && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" /></svg>}
                  {pwSaving ? 'Saving...' : 'Update Password'}
                </button>
              </div>
            </div>
          </div>
        )}
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
