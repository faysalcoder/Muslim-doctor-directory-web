import { useParams, Link } from "react-router-dom";
import { featuredDoctors } from "../data/demoData";
import { DoctorCardHome } from "../components/DoctorCard";

const InfoRow = ({ icon, label, value }) => (
  <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-4 border-b border-gray-100 pb-4 last:border-b-0">
    <div className="flex items-center gap-3 shrink-0">
      <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-700 shrink-0">
        {icon}
      </div>
      <span className="font-semibold text-gray-800 w-36">{label}</span>
    </div>
    <span className="text-gray-600 pl-12 sm:pl-0 text-sm md:text-base leading-relaxed">
      {value}
    </span>
  </div>
);

export default function DoctorProfilePage() {
  const { id } = useParams();
  const doctor =
    featuredDoctors.find((d) => String(d.id) === String(id)) ||
    featuredDoctors[0];
  const others = featuredDoctors.filter((d) => d.id !== doctor.id);

  return (
    <div
      className="bg-[#f7f8fb] text-gray-900 min-h-screen"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Hero */}
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
            {/* Doctor Image Section */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="relative mx-auto lg:mx-0 max-w-[520px]">
                <div className="absolute -inset-6 md:-inset-10 rounded-[2.5rem] bg-emerald-200/30 blur-3xl" />
                <div className="absolute inset-0 rounded-[2rem] overflow-hidden opacity-35 scale-105 blur-xl">
                  {doctor.image ? (
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-full h-full object-cover object-top"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200" />
                  )}
                </div>

                <div className="relative rounded-[2rem] overflow-hidden shadow-[0_25px_80px_-24px_rgba(0,0,0,0.35)] border border-white/70 bg-white">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/12 via-transparent to-transparent z-10" />
                  <div className="aspect-[4/5] w-full">
                    {doctor.image ? (
                      <img
                        src={doctor.image}
                        alt={doctor.name}
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
                  <div className="flex-1 rounded-2xl bg-white/85 backdrop-blur-md border border-white shadow-lg p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-1">
                      Status
                    </p>
                    <p className="font-semibold text-gray-800">
                      {doctor.acceptingPatients
                        ? "Accepting Patients"
                        : "Not Accepting"}
                    </p>
                  </div>
                  <div className="flex-1 rounded-2xl bg-white/85 backdrop-blur-md border border-white shadow-lg p-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-1">
                      Data Tag
                    </p>
                    <p className="font-semibold text-gray-800">
                      {doctor.dataTag}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Text Section */}
            <div className="lg:col-span-6 order-1 lg:order-2 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-emerald-100 shadow-sm text-sm font-semibold text-emerald-700">
                {doctor.dataTag}
              </div>

              <h1 className="mt-5 text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-[1.02]">
                {doctor.name}
              </h1>

              <h2 className="mt-4 text-2xl sm:text-3xl md:text-4xl text-gray-600 font-light italic">
                {doctor.title}
              </h2>

              <p className="mt-6 text-lg sm:text-xl text-gray-700 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                {doctor.practice} — {doctor.category}
              </p>

              <div className="mt-8 flex flex-wrap gap-3 justify-center lg:justify-start">
                {doctor.languages.map((lang) => (
                  <span
                    key={lang}
                    className="bg-emerald-50 text-emerald-700 text-sm font-medium px-4 py-2 rounded-full border border-emerald-100"
                  >
                    {lang}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-center lg:justify-start gap-2">
                <div
                  className={`w-3.5 h-3.5 rounded-full ${
                    doctor.acceptingPatients ? "bg-green-500" : "bg-red-400"
                  }`}
                />
                <span className="text-sm md:text-base text-gray-600">
                  {doctor.acceptingPatients
                    ? "Currently accepting new patients"
                    : "Not accepting new patients"}
                </span>
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <a
                  href={`tel:${doctor.phone}`}
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

      {/* Main content */}
      <main className="max-w-[1500px] mx-auto px-6 md:px-12 -mt-6 md:-mt-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Profile Card */}
          <aside className="lg:col-span-5">
            <div className="bg-white rounded-[2rem] shadow-[0_20px_70px_-20px_rgba(0,0,0,0.12)] p-6 md:p-8 border border-gray-100">
              <div className="space-y-1 mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Doctor Details
                </h3>
                <p className="text-sm text-gray-500">
                  Complete profile information
                </p>
              </div>

              <div className="space-y-4">
                <InfoRow
                  label="Full Name"
                  value={doctor.name}
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
                  label="Title"
                  value={doctor.title}
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
                  label="Practice"
                  value={doctor.practice}
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
                  label="Address"
                  value={doctor.address}
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
                  label="Phone"
                  value={doctor.phone}
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
                  value={doctor.email}
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
                  label="Root Category"
                  value={doctor.rootCategory}
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
                  label="Category"
                  value={doctor.category}
                  icon={
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  }
                />

                <InfoRow
                  label="Affiliation"
                  value={doctor.affiliation}
                  icon={
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  }
                />

                <div className="pt-3">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
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
                      {doctor.dataTag}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 md:hidden grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-1">
                    Status
                  </p>
                  <p className="font-semibold text-gray-800">
                    {doctor.acceptingPatients
                      ? "Accepting Patients"
                      : "Not Accepting"}
                  </p>
                </div>
                <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-gray-500 mb-1">
                    Data Tag
                  </p>
                  <p className="font-semibold text-gray-800">
                    {doctor.dataTag}
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* About section */}
          <section className="lg:col-span-7 py-4 lg:py-10">
            <div className="bg-white rounded-[2rem] shadow-[0_20px_70px_-20px_rgba(0,0,0,0.12)] p-6 md:p-10 border border-gray-100">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                About {doctor.name}
              </h2>

              <div className="space-y-5 text-base md:text-lg text-gray-600 leading-relaxed">
                <p>{doctor.about}</p>
                <p>
                  {doctor.name} believes in a patient-centered approach that
                  respects cultural values and religious beliefs. Patients from
                  the Muslim community can expect a physician who understands
                  their unique needs and provides care with compassion, respect,
                  and cultural competence.
                </p>
              </div>

              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <a
                  href={`tel:${doctor.phone}`}
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

                <Link
                  to="/contact"
                  className="flex items-center justify-center gap-2 border-2 border-[#064e3b] text-[#064e3b] font-bold py-4 px-8 rounded-2xl hover:bg-[#064e3b]/5 transition"
                >
                  Send Message
                </Link>
              </div>
            </div>
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
            {others.slice(0, 6).map((doc) => (
              <DoctorCardHome key={doc.id} doctor={doc} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
