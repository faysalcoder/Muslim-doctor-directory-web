import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAvailableDoctors, saveAvailability, getMemberProfile } from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";
import { BASE_URL } from "../../api/axios";

export default function AvailableDoctorsPage() {
  const { user } = useAuth();
  const [list, setList] = useState([]);
  const [saving, setSaving] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  // Mark-available state: only "available" toggle + optional summary
  const [isMarked, setIsMarked] = useState(false);
  const [summary, setSummary] = useState("");

  // Profile data (read-only, shown for confirmation)
  const [profile, setProfile] = useState(null);

  const load = async () => {
    const res = await getAvailableDoctors();
    setList(res.data || []);
  };

  useEffect(() => {
    load();
    if (user) {
      (async () => {
        try {
          const res = await getMemberProfile();
          const p = res.data?.profile || {};
          setProfile(p);
          // Pre-fill summary from bio if empty
          setSummary(p.bio || "");
        } catch (_) {}
        setProfileLoaded(true);
      })();
    }
  }, [user]);

  const submit = async (e) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    try {
      // Send profile data automatically — user only controls the toggle + summary
      await saveAvailability({
        degrees: profile.graduation_degree || "",
        year_of_experience: profile.experience || "",
        specialty: profile.specialty || "",
        subspecialty: profile.subspecialty || "",
        location: profile.city || profile.location || "",
        summary: summary,
        is_available: isMarked ? "1" : "0",
      });
      toast.success(isMarked ? "You are now marked as available!" : "Availability removed");
      load();
    } catch (err) {
      toast.error(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const infoRow = (label, value) =>
    value ? (
      <div key={label} className="flex gap-2 text-sm">
        <span className="text-gray-400 w-32 shrink-0">{label}</span>
        <span className="text-gray-700 font-medium">{value}</span>
      </div>
    ) : null;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      {/* ── Mark Yourself Available ── */}
      {user && (
        <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
          <div className="bg-[#00342b] px-8 py-5">
            <h1 className="text-xl font-extrabold text-white">Mark Yourself Available</h1>
            <p className="text-emerald-200 text-sm mt-0.5">
              Your profile details are used automatically — just toggle your availability
            </p>
          </div>

          <form onSubmit={submit} className="p-6 space-y-5">
            {!profileLoaded ? (
              <div className="text-gray-400 text-sm py-4">Loading your profile…</div>
            ) : profile ? (
              <>
                {/* Profile Preview Card */}
                <div className="rounded-2xl bg-gray-50 border border-gray-100 p-5 flex gap-4 items-start">
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-xl bg-gray-200 overflow-hidden shrink-0 flex items-center justify-center">
                    {profile.profile_image ? (
                      <img
                        src={
                          String(profile.profile_image).startsWith("http")
                            ? profile.profile_image
                            : `${BASE_URL}/uploads/doctors/${profile.profile_image}`
                        }
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <p className="font-bold text-[#00342b] text-base">
                      {profile.name || "—"}
                      {profile.title ? <span className="text-gray-400 font-normal text-sm ml-2">{profile.title}</span> : null}
                    </p>
                    {infoRow("Specialty", profile.specialty || profile.subspecialty)}
                    {infoRow("Experience", profile.experience ? `${profile.experience} years` : null)}
                    {infoRow("Degree", profile.graduation_degree)}
                    {infoRow("Location", profile.city || profile.location)}
                    <p className="text-xs text-blue-600 mt-1">
                      These details come from your profile.{" "}
                      <a href="/account/profile" className="underline hover:text-blue-800">Update profile</a> to change them.
                    </p>
                  </div>
                </div>

                {/* Summary (optional override) */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Short Summary <span className="text-gray-400 font-normal normal-case">(optional — shown to recruiters)</span>
                  </label>
                  <textarea
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Briefly describe what kind of opportunity you're looking for…"
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00342b] focus:border-[#00342b] resize-y"
                  />
                </div>

                {/* Toggle */}
                <div className="flex items-center justify-between rounded-2xl border border-gray-200 px-5 py-4 bg-white">
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">Mark me as available</p>
                    <p className="text-xs text-gray-400 mt-0.5">Your listing will appear in the Available Doctors section</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMarked((v) => !v)}
                    className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none ${
                      isMarked ? "bg-[#00342b]" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-200 ${
                        isMarked ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-7 py-2.5 rounded-xl bg-[#00342b] text-white font-bold text-sm hover:bg-[#00493c] transition disabled:opacity-60 flex items-center gap-2"
                  >
                    {saving && (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                    )}
                    {saving ? "Saving…" : "Save Availability"}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-gray-500 text-sm py-2">
                Could not load your profile.{" "}
                <a href="/doctor-login" className="text-[#00342b] font-semibold underline">Log in again</a>
              </div>
            )}
          </form>
        </div>
      )}

      {/* ── Available Doctors List ── */}
      <div className="bg-white border rounded-3xl overflow-hidden shadow-sm">
        <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-[#00342b]">Available Doctors</h2>
            <p className="text-sm text-gray-400 mt-0.5">{list.length} doctor{list.length !== 1 ? "s" : ""} currently available</p>
          </div>
        </div>

        <div className="p-6">
          {list.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-200" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              No available doctors found yet.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {list.map((d) => (
                <div key={d.id} className="border border-gray-100 rounded-2xl p-5 hover:border-[#00342b]/30 hover:shadow-sm transition">
                  <div className="font-bold text-[#00342b] text-base">
                    {d.name}
                    {d.title ? <span className="ml-2 text-gray-400 font-normal text-sm">{d.title}</span> : null}
                  </div>
                  {(d.degrees || d.graduation_degree) && (
                    <div className="text-sm text-gray-500 mt-1">{d.degrees || d.graduation_degree}</div>
                  )}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(d.specialty || d.doctor_specialty) && (
                      <span className="bg-emerald-50 text-[#00342b] text-xs font-semibold px-2.5 py-1 rounded-full">
                        {d.specialty || d.doctor_specialty}
                      </span>
                    )}
                    {d.subspecialty && (
                      <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                        {d.subspecialty}
                      </span>
                    )}
                    {(d.year_of_experience || d.doctor_experience) && (
                      <span className="bg-blue-50 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-full">
                        {d.year_of_experience || d.doctor_experience} exp
                      </span>
                    )}
                  </div>
                  {d.location && (
                    <div className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {d.location}
                    </div>
                  )}
                  {d.summary && <p className="text-sm text-gray-600 mt-3 leading-relaxed">{d.summary}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
