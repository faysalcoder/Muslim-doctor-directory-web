import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { DoctorCardSearch } from "../components/DoctorCard";
import { specialties as fallbackSpecialties, locations as fallbackLocations } from "../data/demoData";
import { getPublicDoctors, getFilterOptions } from "../api/axios";

const ITEMS_PER_PAGE = 6;

export default function SearchPage() {
  const [searchParams] = useSearchParams();

  const [specialty, setSpecialty] = useState(
    searchParams.get("specialty") || "",
  );
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [name, setName] = useState(searchParams.get("name") || "");
  const [sortBy, setSortBy] = useState("name");
  const [page, setPage] = useState(1);
  const [filterGender, setFilterGender] = useState([]);
  const [filterLanguages, setFilterLanguages] = useState([]);
  const [filterAccepting, setFilterAccepting] = useState(false);
  const [allDoctors, setAllDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [specialties, setSpecialties] = useState(fallbackSpecialties);
  const [locations, setLocations] = useState(fallbackLocations);

  const loadDoctors = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await getPublicDoctors();
      setAllDoctors(res.data || []);
    } catch (e) {
      setLoadError(e.message || "Failed to load doctors.");
      setAllDoctors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDoctors();
    // Fetch real filter options from DB
    (async () => {
      try {
        const res = await getFilterOptions();
        if (res.specialties?.length) setSpecialties(res.specialties);
        if (res.locations?.length) setLocations(res.locations);
      } catch {
        // keep fallback static lists
      }
    })();
  }, [loadDoctors]);

  const filtered = useMemo(() => {
    let docs = allDoctors.filter((d) => {
      if (specialty && d.specialty !== specialty) return false;
      if (
        location &&
        !String(d.location || "")
          .toLowerCase()
          .includes(location.toLowerCase())
      )
        return false;
      if (name && !d.name.toLowerCase().includes(name.toLowerCase()))
        return false;
      if (filterGender.length && !filterGender.includes(d.gender)) return false;
      const langs = Array.isArray(d.languages)
        ? d.languages
        : String(d.languages || "")
            .split(",")
            .map((l) => l.trim())
            .filter(Boolean);
      if (
        filterLanguages.length &&
        !filterLanguages.some((l) => langs.includes(l))
      )
        return false;
      if (
        filterAccepting &&
        !d.acceptingPatients &&
        d.accepting_patients !== 1 &&
        d.accepting_patients !== "1"
      )
        return false;
      return true;
    });
    if (sortBy === "name")
      docs = [...docs].sort((a, b) => a.name.localeCompare(b.name));
    if (sortBy === "specialty")
      docs = [...docs].sort((a, b) => a.specialty.localeCompare(b.specialty));
    return docs;
  }, [
    allDoctors,
    specialty,
    location,
    name,
    filterGender,
    filterLanguages,
    filterAccepting,
    sortBy,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  const toggleArr = (arr, setArr, val) => {
    setArr((prev) =>
      prev.includes(val) ? prev.filter((x) => x !== val) : [...prev, val],
    );
    setPage(1);
  };

  return (
    <div
      className="bg-[#f8f9fa] text-[#191c1d] min-h-screen"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* ── Hero Search Bar ── */}
      <section
        className="pt-8 pb-12 md:pt-12 md:pb-16 px-4 md:px-12"
        style={{
          background:
            "radial-gradient(circle at top right, rgba(194,207,71,0.15) 0%, rgba(255,255,255,1) 70%)",
        }}
      >
        <div className="max-w-[1500px] mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-[#00342b] mb-2">
              Search Results
            </h1>
            <p className="text-base md:text-lg text-[#3f4945]">
              Showing results for Muslim doctors in your area
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 md:p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] max-w-4xl border border-[#bfc9c4]/30">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              {/* Specialty */}
              <div>
                <label className="block text-sm font-medium text-[#3f4945] mb-2">
                  Specialty
                </label>
                <div className="relative">
                  <select
                    value={specialty}
                    onChange={(e) => {
                      setSpecialty(e.target.value);
                      setPage(1);
                    }}
                    className="w-full bg-white border border-[#bfc9c4] rounded-lg px-4 py-3 text-base focus:ring-[#00342b] focus:border-[#00342b] appearance-none"
                  >
                    <option value="">All Specialties</option>
                    {specialties.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#707975]">
                    ▼
                  </span>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-[#3f4945] mb-2">
                  Location
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="City or area"
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      setPage(1);
                    }}
                    className="w-full bg-white border border-[#bfc9c4] rounded-lg px-10 py-3 text-base focus:ring-[#00342b] focus:border-[#00342b]"
                  />
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#00342b]"
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
                  </svg>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-[#3f4945] mb-2">
                  Doctor Name
                </label>
                <input
                  type="text"
                  placeholder="Enter name..."
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    setPage(1);
                  }}
                  className="w-full bg-white border border-[#bfc9c4] rounded-lg px-4 py-3 text-base focus:ring-[#00342b] focus:border-[#00342b]"
                />
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-[#3f4945] mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-white border border-[#bfc9c4] rounded-lg px-4 py-3 text-base appearance-none"
                >
                  <option value="name">Name A–Z</option>
                  <option value="specialty">Specialty</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main ── */}
      <main className="max-w-[1500px] mx-auto px-4 md:px-12 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* ── Sidebar Filters ── */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="bg-white rounded-xl p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] lg:sticky lg:top-24 border border-[#bfc9c4]/20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-[#00342b]">
                  Filters
                </h2>
                <button
                  onClick={() => {
                    setFilterGender([]);
                    setFilterLanguages([]);
                    setFilterAccepting(false);
                    setPage(1);
                  }}
                  className="text-sm text-[#3f4945] hover:text-[#00342b] underline"
                >
                  Clear all
                </button>
              </div>

              <div className="space-y-8">
                {/* Gender */}
                <div>
                  <h3 className="text-xs font-bold text-[#191c1d] uppercase tracking-wider mb-4">
                    Gender
                  </h3>
                  <div className="space-y-3">
                    {["Male", "Female"].map((g) => (
                      <label
                        key={g}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={filterGender.includes(g)}
                          onChange={() =>
                            toggleArr(filterGender, setFilterGender, g)
                          }
                          className="w-5 h-5 rounded border-[#bfc9c4] text-[#00342b] focus:ring-[#00342b]"
                        />
                        <span className="text-base text-[#3f4945] group-hover:text-[#00342b]">
                          {g} Doctors
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Language */}
                <div>
                  <h3 className="text-xs font-bold text-[#191c1d] uppercase tracking-wider mb-4">
                    Language
                  </h3>
                  <div className="space-y-3">
                    {["English", "Arabic", "Urdu", "Hindi", "Bengali"].map(
                      (lang) => (
                        <label
                          key={lang}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={filterLanguages.includes(lang)}
                            onChange={() =>
                              toggleArr(
                                filterLanguages,
                                setFilterLanguages,
                                lang,
                              )
                            }
                            className="w-5 h-5 rounded border-[#bfc9c4] text-[#00342b] focus:ring-[#00342b]"
                          />
                          <span className="text-base text-[#3f4945] group-hover:text-[#00342b]">
                            {lang}
                          </span>
                        </label>
                      ),
                    )}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <h3 className="text-xs font-bold text-[#191c1d] uppercase tracking-wider mb-4">
                    Availability
                  </h3>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={filterAccepting}
                      onChange={(e) => {
                        setFilterAccepting(e.target.checked);
                        setPage(1);
                      }}
                      className="w-5 h-5 rounded border-[#bfc9c4] text-[#00342b] focus:ring-[#00342b]"
                    />
                    <span className="text-base text-[#3f4945] group-hover:text-[#00342b]">
                      Taking New Patients
                    </span>
                  </label>
                </div>

                <button
                  onClick={() => setPage(1)}
                  className="w-full border-2 border-[#00342b] text-[#00342b] font-bold py-3.5 rounded-lg hover:bg-[#00342b]/5 active:scale-[0.98] transition-all text-sm"
                >
                  Apply All Filters
                </button>
              </div>
            </div>
          </aside>

          {/* ── Results ── */}
          <div className="flex-grow mt-0">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <p className="text-base font-medium text-[#3f4945]">
                Showing{" "}
                <span className="text-[#00342b] font-bold">
                  {filtered.length}
                </span>{" "}
                results
              </p>
            </div>

            {/* Loading skeleton */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-xl overflow-hidden shadow animate-pulse">
                    <div className="pt-[100%] bg-gray-200 relative" />
                    <div className="p-6 space-y-3">
                      <div className="h-5 bg-gray-200 rounded w-3/4 mx-auto" />
                      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
                      <div className="h-10 bg-gray-200 rounded-lg" />
                    </div>
                  </div>
                ))}
              </div>
            ) : loadError ? (
              <div className="text-center py-20">
                <div className="inline-flex flex-col items-center gap-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-8 py-8 max-w-md">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="font-semibold text-lg">Could not load doctors</p>
                  <p className="text-sm text-red-600">{loadError}</p>
                  <button
                    onClick={loadDoctors}
                    className="mt-2 bg-red-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-red-700 transition"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            ) : paginated.length === 0 ? (
              <div className="text-center py-20 text-gray-400">
                <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} />
                </svg>
                <p className="text-lg font-medium">No doctors found matching your criteria.</p>
                <p className="text-sm mt-1">Try adjusting your filters.</p>
                <button onClick={() => {
                    setSpecialty("");
                    setLocation("");
                    setName("");
                    setFilterGender([]);
                    setFilterLanguages([]);
                    setFilterAccepting(false);
                    setPage(1);
                  }}
                  className="mt-4 text-[#00342b] font-semibold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginated.map((doc) => (
                  <DoctorCardSearch key={doc.id} doctor={doc} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2 flex-wrap">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="w-11 h-11 rounded-full border border-[#bfc9c4] flex items-center justify-center text-[#3f4945] hover:border-[#00342b] hover:text-[#00342b] disabled:opacity-40 transition-all"
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
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
                  ),
                )}
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
