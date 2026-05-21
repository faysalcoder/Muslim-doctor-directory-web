import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { getDoctorById, getPublicDoctors } from "../api/axios";
import { DoctorCardHome, normaliseDoctor } from "../components/DoctorCard";
import { galleryImageUrl } from "../api/imageUrl";

const InfoRow = ({ icon, label, value, full = false }) => {
  if (value === null || value === undefined || value === "") return null;

  const renderedValue = Array.isArray(value) ? value.join(", ") : value;

  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 border-b border-gray-100 pb-4 last:border-b-0 ${
        full ? "sm:col-span-2" : ""
      }`}
    >
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 shrink-0">
          {icon}
        </div>
        <span className="font-semibold text-gray-800 w-36">{label}</span>
      </div>
      <span className="text-gray-600 pl-12 sm:pl-0 text-sm md:text-base leading-relaxed whitespace-pre-line">
        {renderedValue}
      </span>
    </div>
  );
};

const SectionTitle = ({ title, subtitle }) => (
  <div className="space-y-1 mb-6">
    <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
    {subtitle ? <p className="text-sm text-gray-500">{subtitle}</p> : null}
  </div>
);

const StatTile = ({ label, value, highlight = false }) => (
  <div
    className={`rounded-2xl border p-4 ${
      highlight
        ? "bg-emerald-50 border-emerald-100"
        : "bg-gray-50 border-gray-100"
    }`}
  >
    <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-1">
      {label}
    </p>
    <p className="font-semibold text-gray-800 leading-snug">{value}</p>
  </div>
);

const emptyText = (value, fallback = "Not provided") => {
  if (value === null || value === undefined || value === "") return fallback;
  return value;
};

export default function DoctorProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [others, setOthers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    let mounted = true;

    (async () => {
      setLoading(true);
      setFetchError("");
      try {
        const [docRes, allRes] = await Promise.all([
          getDoctorById(id),
          getPublicDoctors(),
        ]);

        if (!mounted) return;

        if (docRes?.success && docRes.data) {
          setDoctor(docRes.data);
        } else {
          setDoctor(null);
          setFetchError(docRes?.message || "Doctor not found.");
        }

        if (allRes?.success && Array.isArray(allRes.data)) {
          setOthers(allRes.data);
        } else {
          setOthers([]);
        }
      } catch (e) {
        if (!mounted) return;
        console.error(e);
        setDoctor(null);
        setFetchError("Unable to load doctor profile.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id]);

  const d = useMemo(() => (doctor ? normaliseDoctor(doctor) : null), [doctor]);

  const gallery = useMemo(() => {
    if (!doctor) return [];
    if (Array.isArray(doctor.gallery)) return doctor.gallery;
    if (Array.isArray(d?.gallery)) return d.gallery;
    return [];
  }, [doctor, d]);

  const degreeSummary = useMemo(() => d?.degree || d?.graduation_degree || "", [d]);
  const yearGraduated = useMemo(() => d?.year_graduated || d?.graduation_year || "", [d]);

  const titleLine = useMemo(() => {
    return [d?.practice, d?.category].filter(Boolean).join(" — ");
  }, [d]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f8fb]">
        <div className="text-center">
          <svg
            className="w-10 h-10 animate-spin mx-auto mb-3 text-[#00342b]"
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
          <p className="text-gray-500">Loading doctor profile...</p>
        </div>
      </div>
    );
  }

  if (!d) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f8fb] px-6">
        <div className="text-center max-w-md">
          <p className="text-gray-500 text-lg mb-2">
            {fetchError || "Doctor not found."}
          </p>
          <p className="text-gray-400 text-sm mb-6">
            The record may be missing, unpublished, or no longer available.
          </p>
          <button
            onClick={() => navigate("/search")}
            className="bg-[#00342b] text-white px-6 py-3 rounded-xl font-semibold"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  const languages = Array.isArray(d.languages)
    ? d.languages
    : String(d.languages || "")
        .split(",")
        .map((l) => l.trim())
        .filter(Boolean);

  const acceptingText = d.acceptingPatients
    ? "Currently accepting new patients"
    : "Not accepting new patients";

  const statusText = d.status || "pending";

  return (
    <div
      className="bg-[#f7f8fb] text-gray-900 min-h-screen"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 20% 20%, rgba(16,185,129,0.16) 0%, rgba(16,185,129,0.06) 25%, transparent 55%), linear-gradient(135deg, #f8fffb 0%, #fffdf2 100%)",
          }}
        />

        <div className="relative max-w-[1500px] mx-auto px-6 md:px-12 pt-10 md:pt-16 pb-16 md:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="relative mx-auto lg:mx-0 max-w-[520px]">
                <div className="absolute -inset-6 md:-inset-10 rounded-[2.5rem] bg-emerald-200/30 blur-3xl" />

                <div className="absolute inset-0 rounded-[2rem] overflow-hidden opacity-35 scale-105 blur-xl">
                  {d.image ? (
                    <img
                      src={d.image}
                      alt={d.name}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                </div>

                <div className="relative rounded-[2rem] overflow-hidden shadow-[0_25px_80px_-24px_rgba(0,0,0,0.35)] border border-white/70 bg-white">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/12 via-transparent to-transparent z-10" />
                  <div className="aspect-[4/5] w-full">
                    {d.image ? (
                      <img
                        src={d.image}
                        alt={d.name}
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                        <svg
                          className="w-32 h-32"
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
                </div>

                <div className="hidden md:flex absolute -bottom-6 left-6 right-6 gap-4">
                  <StatTile
                    label="Status"
                    value={
                      d.acceptingPatients ? "Accepting Patients" : "Closed"
                    }
                    highlight
                  />
                  <StatTile label="Data Tag" value={d.dataTag || "Profile"} />
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-emerald-100 shadow-sm text-sm font-semibold text-emerald-700">
                {d.dataTag || "Verified Physician"}
              </div>

              <h1 className="mt-5 text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-[1.02]">
                {d.name}
              </h1>

              {d.title ? (
                <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl text-gray-600 font-light italic">
                  {d.title}
                </h2>
              ) : null}

              <p className="mt-6 text-lg sm:text-xl text-gray-700 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {emptyText(titleLine, "Profile details not provided")}
              </p>

              {d.subspecialty ? (
                <div className="mt-4 inline-flex items-center rounded-full bg-white border border-gray-200 px-4 py-2 text-sm text-gray-700 shadow-sm">
                  Subspecialty: {d.subspecialty}
                </div>
              ) : null}

              {languages.length > 0 ? (
                <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
                  {languages.map((lang) => (
                    <span
                      key={lang}
                      className="bg-emerald-50 text-emerald-700 text-sm font-medium px-4 py-2 rounded-full border border-emerald-100"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <div
                  className={`w-3.5 h-3.5 rounded-full ${
                    d.acceptingPatients ? "bg-green-500" : "bg-red-400"
                  }`}
                />
                <span className="text-sm md:text-base text-gray-600">
                  {acceptingText}
                </span>
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {d.phone ? (
                  <a
                    href={`tel:${d.phone}`}
                    className="inline-flex items-center justify-center gap-2 bg-[#064e3b] text-white font-bold py-4 px-8 rounded-2xl hover:bg-[#043a2d] transition shadow-lg shadow-emerald-900/10"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                    Call Doctor
                  </a>
                ) : null}

                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 border-2 border-[#064e3b] text-[#064e3b] font-bold py-4 px-8 rounded-2xl hover:bg-[#064e3b]/5 transition"
                >
                  Send Message
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-[1500px] mx-auto px-6 md:px-12 -mt-6 md:-mt-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <aside className="lg:col-span-5">
            <div className="bg-white rounded-[2rem] shadow-[0_20px_70px_-20px_rgba(0,0,0,0.12)] p-6 md:p-8 border border-gray-100">
              <SectionTitle
                title="Doctor Details"
                subtitle="Complete profile information"
              />

              <div className="space-y-4">
                <InfoRow
                  label="Full Name"
                  value={d.name}
                  icon={
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  }
                />

                <InfoRow
                  label="Doctor ID"
                  value={d.doctor_id || d.id}
                  icon={
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  }
                />

                <InfoRow
                  label="Title"
                  value={d.title}
                  icon={
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  }
                />

                <InfoRow
                  label="Academic Title"
                  value={d.academic_title}
                  icon={
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 14l9-5-9-5-9 5 9 5z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                      <path
                        d="M12 14l6.16-3.422A12.083 12.083 0 0118 12c0 3.866-2.686 7.16-6 8-3.314-.84-6-4.134-6-8 0-.473.034-.94.102-1.422L12 14z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  }
                />

                <InfoRow
                  label="Academic Affiliation"
                  value={d.academic_affiliation}
                  icon={
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M4 6h16M4 12h16M4 18h16"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  }
                />

                <InfoRow
                  label="Specialty"
                  value={d.specialty}
                  icon={
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  }
                />

                <InfoRow
                  label="Subspecialty"
                  value={d.subspecialty}
                  icon={
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  }
                />

                <InfoRow
                  label="Practice"
                  value={d.practice}
                  icon={
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  }
                />

                <InfoRow
                  label="Experience"
                  value={d.experience}
                  icon={
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 8v4l3 3M12 3a9 9 0 100 18 9 9 0 000-18z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  }
                />

                <InfoRow
                  label="Degree"
                  value={degreeSummary}
                  icon={
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 14l9-5-9-5-9 5 9 5z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                      <path
                        d="M5 12v4c0 1.1 3.134 4 7 4s7-2.9 7-4v-4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  }
                />

                <InfoRow
                  label="Year Graduated"
                  value={yearGraduated}
                  icon={
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 14l9-5-9-5-9 5 9 5z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                      <path
                        d="M6 14v4c0 1.1 2.686 3 6 3s6-1.9 6-3v-4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  }
                />

                <InfoRow
                  label="Medical School Attended"
                  value={d.medical_school_attended || d.medical_school_affiliation}
                  icon={
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 8v8m4-4H8m8.5-7.5a9 9 0 11-13 0"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  }
                />

                <InfoRow
                  label="Gender"
                  value={d.gender}
                  icon={
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M15 19a6 6 0 100-12 6 6 0 000 12zM19 5l-3 3M4 20l4-4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  }
                />

                <InfoRow
                  label="Languages"
                  value={languages}
                  icon={
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M3 5h12M9 3v2m4 0c0 5.523-4.477 10-10 10m10 0c0 1.657 1.343 3 3 3m4-3h-3m3 0a7 7 0 00-7-7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  }
                />

                <InfoRow
                  label="Location"
                  value={d.location}
                  icon={
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                      <path
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  }
                />

                <InfoRow
                  label="Address"
                  value={d.address || d.location}
                  icon={
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  }
                />

                <InfoRow
                  label="Phone"
                  value={d.phone}
                  icon={
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  }
                />

                <InfoRow
                  label="Email"
                  value={d.email}
                  icon={
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  }
                />

                <InfoRow
                  label="Hospital Affiliations"
                  value={d.hospital_affiliations}
                  icon={
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M4 21V5a2 2 0 012-2h12a2 2 0 012 2v16M9 21v-8h6v8M9 7h6M9 11h6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  }
                />

                <InfoRow
                  label="Awards"
                  value={d.awards}
                  icon={
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 15l-3.09 1.626.591-3.445L7 10.97l3.455-.502L12 7.333l1.545 3.135 3.455.502-2.501 2.211.591 3.445z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                      <path
                        d="M12 3v4m0 10v4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  }
                />

                <InfoRow
                  label="Status"
                  value={statusText}
                  icon={
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M9 12l2 2 4-4m5-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  }
                />

                <div className="pt-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                      </svg>
                    </div>
                    <span className="font-semibold text-gray-800 w-36">
                      Data Tag
                    </span>
                  </div>
                  <span className="text-gray-600 pl-12 sm:pl-0 text-sm md:text-base">
                    {d.dataTag || "Profile"}
                  </span>
                </div>
              </div>

              <div className="mt-6 md:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
                <StatTile
                  label="Status"
                  value={d.acceptingPatients ? "Accepting Patients" : "Closed"}
                  highlight
                />
                <StatTile label="Data Tag" value={d.dataTag || "Profile"} />
              </div>
            </div>
          </aside>

          <section className="lg:col-span-7 py-4 lg:py-10 space-y-8">
            <div className="bg-white rounded-[2rem] shadow-[0_20px_70px_-20px_rgba(0,0,0,0.12)] p-6 md:p-10 border border-gray-100">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                About {d.name}
              </h2>

              <div className="space-y-5 text-base md:text-lg text-gray-600 leading-relaxed">
                {d.bio ? (
                  <p className="whitespace-pre-line">{d.bio}</p>
                ) : (
                  <p>
                    {d.name} is a dedicated physician committed to providing
                    compassionate, culturally sensitive care.
                  </p>
                )}

                <p>
                  Patients can review the profile details above for education,
                  specialty, affiliations, and availability. This section is
                  designed to match the fields saved in the doctor form without
                  hiding empty records.
                </p>
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                {d.phone ? (
                  <a
                    href={`tel:${d.phone}`}
                    className="flex items-center justify-center gap-2 bg-[#064e3b] text-white font-bold py-4 px-8 rounded-2xl hover:bg-[#043a2d] transition shadow-lg shadow-emerald-900/10"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                    Call Doctor
                  </a>
                ) : null}

                <Link
                  to="/contact"
                  className="flex items-center justify-center gap-2 border-2 border-[#064e3b] text-[#064e3b] font-bold py-4 px-8 rounded-2xl hover:bg-[#064e3b]/5 transition"
                >
                  Send Message
                </Link>
              </div>
            </div>

            {gallery.length > 0 ? (
              <div className="bg-white rounded-[2rem] shadow-[0_20px_70px_-20px_rgba(0,0,0,0.12)] p-6 md:p-10 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Gallery
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {gallery.map((g, i) => {
                    const src = galleryImageUrl(g.image || g);
                    return src ? (
                      <div
                        key={g.id || i}
                        className="aspect-square rounded-xl overflow-hidden bg-gray-100"
                      >
                        <img
                          src={src}
                          alt={`Gallery ${i + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            ) : null}
          </section>
        </div>
      </main>

      {/* Featured Doctors */}
      <section className="bg-[#f7f8fb] pt-16 md:pt-24 pb-20 px-6 md:px-12 mt-10">
        <div className="max-w-[1500px] mx-auto rounded-[2rem] bg-white p-6 md:p-12 shadow-[0_20px_70px_-20px_rgba(0,0,0,0.08)] border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
            <h2 className="text-2xl md:text-3xl font-light text-gray-900">
              Featured <span className="font-bold">Muslim</span> Doctors
            </h2>
            <Link
              to="/search"
              className="bg-gray-900 text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition w-full sm:w-auto text-center font-medium"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-6">
            {others.slice(0, 5).map((doc) => (
              <DoctorCardHome key={doc.id} doctor={doc} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
