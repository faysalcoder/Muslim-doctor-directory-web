import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getForumPosts } from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";

export default function ForumList() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [type, setType] = useState("");
  const [q, setQ] = useState("");

  useEffect(() => { (async () => { const res = await getForumPosts({ type, q }); setPosts(res.data || []); })(); }, [type, q]);
  const filtered = useMemo(() => posts, [posts]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500">Forum</p>
          <h1 className="text-3xl font-extrabold text-[#00342b]">Case reports, questions, and opinions</h1>
        </div>
        {user && <Link to="/forum/create" className="px-5 py-3 rounded-xl bg-[#00342b] text-white font-semibold">Create post</Link>}
      </div>
      <div className="flex gap-3 flex-wrap mb-5">
        {["", "question", "case_report", "image", "discussion"].map((v) => <button key={v || 'all'} onClick={() => setType(v)} className={`px-4 py-2 rounded-full border text-sm font-semibold ${type === v ? 'bg-[#00342b] text-white' : 'bg-white'}`}>{v ? v.replace('_',' ') : 'All'}</button>)}
        <input className="px-4 py-2 rounded-full border flex-1 min-w-[220px]" placeholder="Search forum" value={q} onChange={(e)=>setQ(e.target.value)} />
      </div>
      <div className="grid gap-4">
        {filtered.map((p) => (
          <Link key={p.id} to={`/forum/${p.id}`} className="bg-white border rounded-3xl p-5 hover:shadow-sm transition">
            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 uppercase tracking-[0.2em]">
              <span>{p.type}</span><span>•</span><span>{p.author_name}</span><span>•</span><span>{p.comment_count || 0} replies</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mt-2">{p.title}</h2>
            <p className="text-gray-600 mt-2 line-clamp-2">{p.content}</p>
          </Link>
        ))}
        {!filtered.length && <div className="p-8 text-center text-gray-500 bg-white border rounded-3xl">No forum posts yet.</div>}
      </div>
    </div>
  );
}
