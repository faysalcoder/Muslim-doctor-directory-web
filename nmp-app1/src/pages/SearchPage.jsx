import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { DoctorCardSearch } from "../components/DoctorCard";
import { featuredDoctors, specialties, locations } from "../data/demoData";

const ITEMS_PER_PAGE = 6;

export default function SearchPage() {
  const [searchParams] = useSearchParams();

  const [specialty, setSpecialty] = useState(searchParams.get("specialty") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [name, setName] = useState(searchParams.get("name") || "");
  const [sortBy, setSortBy] = useState("name");
  const [page, setPage] = useState(1);

  // Filters state
  const [filterGender, setFilterGender] = useState([]);
  const [filterLanguages, setFilterLanguages] = useState([]);
  const [filterAccepting, setFilterAccepting] = useState(false);

  // Use all 6 demo doctors (repeated to simulate more results)
  const allDoctors = useMemo(() => {
    return [...featuredDoctors, ...featuredDoctors].map((d, i) => ({ ...d, id: d.id + i * 10 }));
  }, []);

  const filtered = useMemo(() => {
    return allDoctors.filter((d) => {
      if (specialty && d.specialty !== specialty) return false;
      if (location && d.location !== location) return false;
      if (name && !d.name.toLowerCase().includes(name.toLowerCase())) return false;
      if (filterGender.length && !filterGender.includes(d.gender)) return false;
      if (filterLanguages.length && !filterLanguages.some((l) => d.languages.includes(l))) return false;
      if (filterAccepting && !d.acceptingPatients) return false;
      return true;
    });
  }, [allDoctors, specialty, location, name, filterGender, filterLanguages, filterAccepting]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const toggleArr = (arr, setArr, val) => {
    setArr((prev) => (prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val]));
    setPage(1);
  };

  return (
    <div className="bg-[#f8f9fa] text-[#191c1d] min-h-screen" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Hero gradient search bar */}
      <section
        className="pt-8 pb-12 md:pt-12 md:pb-16 px-4 md:px-12"
        style={{ background: "radial-gradient(circle at top right, rgba(194,207,71,0.15) 0%, rgba(255,255,255,1) 70%)" }}
      >
        <div className="max-w-[1500px] mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#00342b] mb-2">Search Results</h1>
            <p className="text-base md:text-lg text-[#3f4945]">Showing results for Muslim doctors in your area</p>
          </div>

          {/* Search bar */}
          <div className="bg-white rounded-xl p-4 md:p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] max-w-4xl border border-[#bfc9c4]/30">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium text-[#3f4945] mb-2">Specialty</label>
                <div className="relative">
                  <select
                    value={specialty}
                    onChange={(e) => { setSpecialty(e.target.value); setPage(1); }}
                    className="w-full bg-white border border-[#bfc9c4] rounded-lg px-4 py-3 text-base focus:ring-[#00342b] focus:border-[#00342b] appearance-none"
                  >
                    <option value="">All Specialties</option>
                    {specialties.map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#707975]">▼</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3f4945] mb-2">Location</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="City or area"
                    value={location}
                    onChange={(e) => { setLocation(e.target.value); setPage(1); }}
                    className="w-full bg-white border border-[#bfc9c4] rounded-lg px-10 py-3 text-base focus:ring-[#00342b] focus:border-[#00342b]"
                  />
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00342b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                  </svg>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3f4945] mb-2">Doctor Name</label>
                <input
                  type="text"
                  placeholder="Enter name..."
                  value={name}
                  onChange={(e) => { setName(e.target.value); setPage(1); }}
                  className="w-full bg-white border border-[#bfc9c4] rounded-lg px-4 py-3 text-base focus:ring-[#00342b] focus:border-[#00342b]"
                />
              </div>

              <div>
                <button
                  onClick={() => setPage(1)}
                  className="w-full bg-[#00342b] text-white font-bold py-3.5 rounded-lg hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
                  </svg>
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main */}
      <main className="max-w-[1500px] mx-auto px-4 md:px-12 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="bg-white rounded-xl p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] lg:sticky lg:top-24 border border-[#bfc9c4]/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-[#00342b]">Filters</h2>
                <button
                  onClick={() => { setFilterGender([]); setFilterLanguages([]); setFilterAccepting(false); setPage(1); }}
                  className="text-sm text-[#3f4945] hover:text-[#00342b] underline"
                >
                  Clear all
                </button>
              </div>

              <div className="space-y-8">
                {/* Gender */}
                <div>
                  <h3 className="text-xs font-bold text-[#191c1d] uppercase tracking-wider mb-4">Gender</h3>
                  <div className="space-y-3">
                    {["Male", "Female"].map((g) => (
                      <label key={g} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={filterGender.includes(g)}
                          onChange={() => toggleArr(filterGender, setFilterGender, g)}
                          className="w-5 h-5 rounded border-[#bfc9c4] text-[#00342b] focus:ring-[#00342b]"
                        />
                        <span className="text-base text-[#3f4945] group-hover:text-[#00342b]">{g} Doctors</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Language */}
                <div>
                  <h3 className="text-xs font-bold text-[#191c1d] uppercase tracking-wider mb-4">Language</h3>
                  <div className="space-y-3">
                    {["English", "Arabic", "Urdu", "Hindi", "Bengali"].map((lang) => (
                      <label key={lang} className="flex items-center gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={filterLanguages.includes(lang)}
                          onChange={() => toggleArr(filterLanguages, setFilterLanguages, lang)}
                          className="w-5 h-5 rounded border-[#bfc9c4] text-[#00342b] focus:ring-[#00342b]"
                        />
                        <span className="text-base text-[#3f4945] group-hover:text-[#00342b]">{lang}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h3 className="text-xs font-bold text-[#191c1d] uppercase tracking-wider mb-4">Availability</h3>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filterAccepting}
                      onChange={(e) => { setFilterAccepting(e.target.checked); setPage(1); }}
                      className="w-5 h-5 rounded border-[#bfc9c4] text-[#00342b] focus:ring-[#00342b]"
                    />
                    <span className="text-base text-[#3f4945] group-hover:text-[#00342b]">Taking New Patients</span>
                  </label>
                </div>

                <button className="w-full border-2 border-[#00342b] text-[#00342b] font-bold py-3.5 rounded-lg hover:bg-[#00342b]/5 active:scale-[0.98] transition-all text-sm">
                  Apply All Filters
                </button>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-grow mt-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <p className="text-base font-medium text-[#3f4945]">
                Showing <span className="text-[#00342b] font-bold">{filtered.length}</span> results
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#3f4945] whitespace-nowrap">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-transparent border-none text-sm font-bold text-[#00342b] focus:ring-0 cursor-pointer py-1 px-2"
                >
                  <option value="name">Name A-Z</option>
                  <option value="specialty">Specialty</option>
                </select>
              </div>
            </div>

            {paginated.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
                </svg>
                <p className="text-lg font-medium">No doctors found matching your criteria.</p>
                <p className="text-sm mt-1">Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginated.map((doc) => (
                  <DoctorCardSearch key={doc.id} doctor={doc} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2 flex-wrap">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-11 h-11 rounded-full border border-[#bfc9c4] flex items-center justify-center text-[#3f4945] hover:border-[#00342b] hover:text-[#00342b] disabled:opacity-40 transition-all"
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-11 h-11 rounded-full font-bold text-sm transition-all ${
                      p === page
                        ? "bg-[#00342b] text-white"
                        : "border border-[#bfc9c4] text-[#3f4945] hover:border-[#00342b] hover:text-[#00342b]"
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="w-11 h-11 rounded-full border border-[#bfc9c4] flex items-center justify-center text-[#3f4945] hover:border-[#00342b] hover:text-[#00342b] disabled:opacity-40 transition-all"
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
