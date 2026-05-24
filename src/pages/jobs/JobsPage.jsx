import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAvailableDoctors, getJobPosts } from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";

export default function JobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [tab, setTab] = useState('jobs');

  useEffect(() => { (async () => { const [j,a] = await Promise.all([getJobPosts(), getAvailableDoctors()]); setJobs(j.data || []); setDoctors(a.data || []); })(); }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Jobs</p>
          <h1 className="text-3xl font-extrabold text-[#00342b]">Posted jobs and available doctors</h1>
        </div>
        <div className="flex gap-3">
          {user && <Link to="/jobs/create" className="px-5 py-3 rounded-xl bg-[#00342b] text-white font-semibold">Post a job</Link>}
          {user && <Link to="/jobs/available" className="px-5 py-3 rounded-xl border font-semibold">My availability</Link>}
        </div>
      </div>
      <div className="flex gap-3 mb-5">
        <button onClick={() => setTab('jobs')} className={`px-4 py-2 rounded-full border font-semibold ${tab==='jobs' ? 'bg-[#00342b] text-white' : 'bg-white'}`}>Posted jobs</button>
        <button onClick={() => setTab('doctors')} className={`px-4 py-2 rounded-full border font-semibold ${tab==='doctors' ? 'bg-[#00342b] text-white' : 'bg-white'}`}>Available doctors</button>
      </div>
      {tab === 'jobs' ? (
        <div className="grid gap-4">{jobs.map((j) => <div key={j.id} className="bg-white border rounded-3xl p-5"><div className="text-xs uppercase tracking-[0.2em] text-gray-500">{j.status}</div><h2 className="text-xl font-bold text-gray-900 mt-2">{j.post_name}</h2><div className="text-sm text-gray-500 mt-1">{j.hospital_name} • {j.job_location}</div><div className="mt-3 whitespace-pre-line text-gray-700 line-clamp-3">{j.description}</div></div>)}{!jobs.length && <div className="bg-white border rounded-3xl p-8 text-center text-gray-500">No job posts yet.</div>}</div>
      ) : (
        <div className="grid gap-4">{doctors.map((d) => <div key={d.id} className="bg-white border rounded-3xl p-5"><h2 className="text-xl font-bold text-gray-900">{d.name}</h2><div className="text-sm text-gray-500 mt-1">{d.degree || d.graduation_degree || d.degrees || ''} • {d.year_of_experience || d.doctor_experience || ''}</div><div className="text-sm text-gray-500 mt-1">{d.specialty || d.doctor_specialty || ''} {d.subspecialty ? `• ${d.subspecialty}` : ''}</div><div className="text-sm text-gray-500 mt-1">{d.location || ''}</div></div>)}{!doctors.length && <div className="bg-white border rounded-3xl p-8 text-center text-gray-500">No available doctors yet.</div>}</div>
      )}
    </div>
  );
}
