import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import toast from "react-hot-toast";
import { getForumAdminData, moderateForumEntity } from "../../api/axios";

export default function ForumModeration() {
  const [data, setData] = useState({ posts: [], comments: [] });
  const load = async () => { const res = await getForumAdminData(); setData(res.data || { posts: [], comments: [] }); };
  useEffect(() => { load(); }, []);
  const act = async (entity, id, status) => { try { await moderateForumEntity(entity, id, status); toast.success('Updated'); load(); } catch (e) { toast.error(e.message || 'Failed'); } };
  return <AdminLayout><div className="bg-white rounded-3xl border p-6 space-y-8"><h1 className="text-2xl font-extrabold text-[#00342b]">Forum Moderation</h1><section><h2 className="font-bold mb-3">Posts</h2><div className="grid gap-3">{data.posts.map((p)=><div key={p.id} className="border rounded-2xl p-4 flex justify-between gap-3"><div><div className="font-semibold">{p.title}</div><div className="text-sm text-gray-500">{p.author_name} • {p.status}</div></div><div className="flex gap-2"><button onClick={()=>act('post', p.id, 'published')} className="px-3 py-2 rounded-lg border">Publish</button><button onClick={()=>act('post', p.id, 'hidden')} className="px-3 py-2 rounded-lg border">Hide</button></div></div>)}{!data.posts.length && <p className="text-gray-500">No posts.</p>}</div></section><section><h2 className="font-bold mb-3">Comments</h2><div className="grid gap-3">{data.comments.map((c)=><div key={c.id} className="border rounded-2xl p-4 flex justify-between gap-3"><div><div className="font-semibold">{c.author_name}</div><div className="text-sm text-gray-500">{c.comment}</div></div><div className="flex gap-2"><button onClick={()=>act('comment', c.id, 'published')} className="px-3 py-2 rounded-lg border">Show</button><button onClick={()=>act('comment', c.id, 'hidden')} className="px-3 py-2 rounded-lg border">Hide</button></div></div>)}{!data.comments.length && <p className="text-gray-500">No comments.</p>}</div></section></div></AdminLayout>;
}
