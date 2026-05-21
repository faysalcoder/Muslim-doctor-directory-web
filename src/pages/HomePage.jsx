import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DoctorCardHome } from "../components/DoctorCard";
import { specialties as fallbackSpecialties, locations as fallbackLocations } from "../data/demoData";
import { getPublicDoctors, getFilterOptions } from "../api/axios";
import AddDoctorModal from "../components/AddDoctorModal";

export default function HomePage() {
  const navigate = useNavigate();
  const [searchSpecialty, setSearchSpecialty] = useState("");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchName, setSearchName] = useState("");
  const [featuredDoctors, setFeaturedDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [doctorError, setDoctorError] = useState("");
  const [specialties, setSpecialties] = useState(fallbackSpecialties);
  const [locations, setLocations] = useState(fallbackLocations);
  const [doctorModalOpen, setDoctorModalOpen] = useState(false);

  useEffect(() => {
    // Load featured doctors
    (async () => {
      try {
        const res = await getPublicDoctors();
        setFeaturedDoctors(res.data.slice(0, 4));
      } catch (e) {
        setDoctorError("Could not load doctors. Please check your API connection.");
      } finally {
        setLoadingDoctors(false);
      }
    })();

    // Load filter options from real DB
    (async () => {
      try {
        const res = await getFilterOptions();
        if (res.specialties?.length) setSpecialties(res.specialties);
        if (res.locations?.length) setLocations(res.locations);
      } catch {
        // silently keep fallback static lists
      }
    })();
  }, []);

  const handleSearch = () => {
    navigate(
      `/search?specialty=${encodeURIComponent(searchSpecialty)}&location=${encodeURIComponent(searchLocation)}&name=${encodeURIComponent(searchName)}`
    );
  };

  const steps = [
    {
      num: "1",
      numBg: "bg-[#00342b]",
      title: "Search for a Doctor",
      desc: "Use our search tools to find Muslim Doctors by specialty, location, or name.",
      icon: (
        <div className="relative scale-90 md:scale-100">
          <div className="w-24 h-24 border-[8px] border-[#00342b] rounded-full" />
          <div className="w-12 h-[8px] bg-[#00342b] absolute -bottom-2 -right-4 rotate-45 rounded-full" />
        </div>
      ),
    },
    {
      num: "2",
      numBg: "bg-orange-400",
      title: "View Doctor Profile",
      desc: "Browse detailed profiles including specialty, location, languages, and contact info.",
      icon: (
        <div className="bg-[#00342b] w-28 md:w-32 h-20 rounded-lg p-2 relative shadow-lg">
          <div className="flex gap-2">
            <div className="w-6 h-6 md:w-8 md:h-8 bg-orange-200 rounded-sm shrink-0" />
            <div className="flex flex-col gap-1 w-full">
              <div className="h-1 bg-white/40 w-full rounded" />
              <div className="h-1 bg-white/40 w-3/4 rounded" />
              <div className="h-1 bg-white/40 w-1/2 rounded" />
            </div>
          </div>
          <div className="mt-3 flex gap-1">
            <div className="h-2 w-2 bg-white/40" />
            <div className="h-2 w-2 bg-white/40" />
            <div className="h-2 w-2 bg-white/40" />
          </div>
          <div className="absolute -top-3 -right-3 bg-[#00342b] rounded-full border-4 border-emerald-500 p-0.5">
            <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      ),
    },
    {
      num: "3",
      numBg: "bg-teal-700",
      title: "Connect & Book",
      desc: "Contact the doctor directly or request an appointment through our platform.",
      icon: (
        <div className="relative">
          <div className="bg-[#00342b] w-24 md:w-28 h-20 rounded-t-xl overflow-hidden shadow-lg">
            <div className="bg-white/10 h-4 w-full flex justify-around px-2 py-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-1 h-3 bg-white/30 rounded-full" />
              ))}
            </div>
            <div className="grid grid-cols-4 gap-1 p-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-3 w-full bg-white/20 rounded-sm" />
              ))}
            </div>
          </div>
          <div className="absolute -bottom-3 right-0 bg-[#00342b] border-4 border-emerald-500 rounded-full p-1">
            <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="font-sans text-gray-900 bg-white overflow-x-hidden">
      {/* Hero */}
      <section
        className="relative min-h-[680px] md:min-h-[760px] lg:min-h-[700px] flex items-center overflow-hidden"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/assets/doctor-bg.png)`,
          backgroundPosition: "center center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-white/100 via-white/0 to-white/0 z-10" />
        <div className="absolute inset-0 bg-black/5 z-0" />

        <div className="max-w-[1500px] mx-auto w-full px-5 md:px-10 lg:px-12 relative z-10">
          <div className="w-full flex justify-center lg:justify-start">
            <div className="w-full max-w-2xl lg:max-w-[720px] py-16 md:py-24 lg:py-28 text-left">
              <div className="flex items-center gap-3 mb-6 md:mb-8">
                <div className="bg-[#00342b] text-white rounded-lg h-12 w-12 flex items-center justify-center text-2xl font-bold shrink-0 shadow-lg">N</div>
                <div className="leading-tight">
                  <p className="text-[10px] md:text-xs tracking-[0.28em] font-semibold text-gray-700">NETWORK OF</p>
                  <p className="text-lg md:text-xl font-bold text-gray-900 uppercase">Muslim Physicians</p>
                </div>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-5 md:mb-6">
                Your trusted source
              </h1>
              <p className="text-base md:text-xl text-gray-600 max-w-xl mb-8 md:mb-10">
                Easily discover Muslim doctors who understand your culture and values.
              </p>

              {/* Search Card */}
              <div className="bg-white/95 backdrop-blur-md rounded-[28px] p-5 md:p-7 shadow-2xl border border-gray-100 max-w-[650px] w-full">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-4">
                  {/* Specialty */}
                  <div className="md:col-span-6 relative">
                    <select
                      value={searchSpecialty}
                      onChange={(e) => setSearchSpecialty(e.target.value)}
                      className="w-full h-[54px] border border-gray-300 rounded-xl px-4 pr-10 appearance-none focus:ring-2 focus:ring-[#00342b] focus:border-[#00342b] outline-none bg-white text-gray-700"
                    >
                      <option value="">Search by specialty</option>
                      {specialties.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-[#00342b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M19 9l-7 7-7-7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="md:col-span-6 relative">
                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0L6.343 16.657a8 8 0 1111.314 0z" strokeWidth={2} />
                      <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth={2} />
                    </svg>
                    <select
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="w-full h-[54px] border border-gray-300 rounded-xl pl-11 pr-10 appearance-none focus:ring-2 focus:ring-[#00342b] focus:border-[#00342b] outline-none bg-white text-gray-700"
                    >
                      <option value="">Select Location</option>
                      {locations.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-[#00342b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M19 9l-7 7-7-7" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  <div className="md:col-span-9">
                    <input
                      type="text"
                      placeholder="Enter doctor name..."
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      className="w-full h-[54px] border border-gray-300 rounded-xl px-4 focus:ring-2 focus:ring-[#00342b] focus:border-[#00342b] outline-none"
                    />
                  </div>
                  <div className="md:col-span-3 flex flex-col gap-2">
                    <button
                      onClick={handleSearch}
                      className="h-[54px] w-full bg-[#00342b] text-white rounded-xl font-semibold hover:bg-[#00493c] transition shadow-lg"
                    >
                      Search
                    </button>
                    <button
                      onClick={() => navigate("/search")}
                      className="text-[10px] text-[#00342b] font-bold uppercase tracking-[0.2em] text-center"
                    >
                      Search All
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Doctors */}
      <section className="py-12 md:py-20">
        <div className="max-w-[1500px] mx-auto px-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-normal text-gray-800">
              Featured <span className="font-bold">Muslim</span> Doctors
            </h2>
            <button
              onClick={() => navigate("/search")}
              className="bg-zinc-800 text-white px-8 py-3 rounded-xl font-medium hover:bg-zinc-700 transition w-full sm:w-auto text-center"
            >
              View All
            </button>
          </div>

          {loadingDoctors ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-50 p-4 rounded-[2rem] border border-gray-100 animate-pulse">
                  <div className="bg-gray-200 h-64 mb-4 rounded-2xl" />
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
                  <div className="h-10 bg-gray-200 rounded-xl" />
                </div>
              ))}
            </div>
          ) : doctorError ? (
            <div className="col-span-4 text-center py-16">
              <div className="inline-flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-6 py-4">
                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {doctorError}
              </div>
            </div>
          ) : featuredDoctors.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              No verified doctors found yet. Be the first to join the network!
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {featuredDoctors.map((doc) => (
                <DoctorCardHome key={doc.id} doctor={doc} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Are You a Doctor? */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1500px] mx-auto px-6">
          <div className="relative rounded-[2.5rem] overflow-hidden bg-[#00342b]">
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/5 rounded-full pointer-events-none" />
            <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-[#c2cf47]/10 rounded-full pointer-events-none" />
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-10 px-8 md:px-14 py-12 md:py-16">
              <div className="shrink-0 flex items-center justify-center w-36 h-36 rounded-3xl bg-white/10 border border-white/20 shadow-xl">
                <svg className="w-16 h-16 text-[#c2cf47]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1 text-center lg:text-left">
                <span className="inline-block bg-[#c2cf47]/20 text-[#c2cf47] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                  For Physicians
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">Are you a Muslim Physician?</h2>
                <p className="text-white/70 text-base md:text-lg max-w-xl mb-2">
                  Join our growing network and connect with patients who value your cultural understanding and faith-sensitive approach to care.
                </p>
                <ul className="text-white/60 text-sm mt-4 space-y-1.5 hidden md:block">
                  {["Free to list — no subscription needed", "Reach patients who share your values", "Profile reviewed and verified by our team"].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#c2cf47] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="shrink-0 flex flex-col items-center gap-3">
                <button
                  onClick={() => setDoctorModalOpen(true)}
                  className="flex items-center gap-2 bg-[#c2cf47] text-[#00342b] px-8 py-4 rounded-2xl font-bold text-base hover:bg-[#d4e053] transition shadow-xl"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                  </svg>
                  List Myself as a Doctor
                </button>
                <p className="text-white/40 text-xs">Takes less than 5 minutes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AddDoctorModal open={doctorModalOpen} onClose={() => setDoctorModalOpen(false)} />

      {/* How It Works */}
      <section className="bg-gray-50/50 py-16 md:py-24 rounded-t-[3rem] md:rounded-t-[5rem]">
        <div className="max-w-[1500px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">How It Works</h2>
            <p className="text-gray-500">Find your trusted Muslim physician in 3 simple steps</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div key={step.num} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 flex flex-col">
                <div
                  className="p-8 flex justify-center items-center relative h-48 md:h-52"
                  style={{ background: "linear-gradient(135deg, rgba(236,253,245,0.8) 0%, rgba(209,250,229,0.5) 100%)" }}
                >
                  <span className={`absolute top-4 left-4 ${step.numBg} text-white w-10 h-10 flex items-center justify-center rounded-lg font-bold text-xl`}>
                    {step.num}
                  </span>
                  {step.icon}
                </div>
                <div className="p-6 md:p-8 text-center">
                  <h4 className="text-xl md:text-2xl font-bold mb-3">{step.title}</h4>
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
