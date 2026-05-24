import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import toast from "react-hot-toast";
import { getJobsAdminData, moderateJobEntity } from "../../api/axios";

export default function JobsAdmin() {
  const [data, setData] = useState({ jobs: [], availability: [] });
  const load = async () => { const res = await getJobsAdminData(); setData(res.data || { jobs: [], availability: [] }); };
  useEffect(() => { load(); }, []);
  const act = async (entity, id, status) => { try { await moderateJobEntity(entity, id, status); toast.success('Updated'); load(); } catch (e) { toast.error(e.message || 'Failed'); } };
  return <AdminLayout><div className="bg-white rounded-3xl border p-6 space-y-8"><h1 className="text-2xl font-extrabold text-[#00342b]">Jobs Management</h1><section><h2 className="font-bold mb-3">Job Posts</h2><div className="grid gap-3">{data.jobs.map((j)=><div key={j.id} className="border rounded-2xl p-4 flex justify-between gap-3"><div><div className="font-semibold">{j.post_name}</div><div className="text-sm text-gray-500">{j.hospital_name} • {j.job_location} • {j.status}</div></div><div className="flex gap-2"><button onClick={()=>act('job', j.id, 'open')} className="px-3 py-2 rounded-lg border">Open</button><button onClick={()=>act('job', j.id, 'hidden')} className="px-3 py-2 rounded-lg border">Hide</button></div></div>)}{!data.jobs.length && <p className="text-gray-500">No jobs.</p>}</div></section><section><h2 className="font-bold mb-3">Available Doctors</h2><div className="grid gap-3">{data.availability.map((a)=><div key={a.id} className="border rounded-2xl p-4 flex justify-between gap-3"><div><div className="font-semibold">{a.doctor_name}</div><div className="text-sm text-gray-500">{a.specialty} • {a.location} • {a.status}</div></div><div className="flex gap-2"><button onClick={()=>act('availability', a.id, 'open')} className="px-3 py-2 rounded-lg border">Open</button><button onClick={()=>act('availability', a.id, 'hidden')} className="px-3 py-2 rounded-lg border">Hide</button></div></div>)}{!data.availability.length && <p className="text-gray-500">No availability listings.</p>}</div></section></div></AdminLayout>;
}
