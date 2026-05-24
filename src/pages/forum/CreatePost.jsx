import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { createForumPost } from "../../api/axios";

export default function CreateForumPost() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ type: 'question', title: '', content: '', tags: '' });
  const [image, setImage] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    try { const res = await createForumPost(form, image); toast.success('Forum post published'); navigate(`/forum/${res.id}`); } catch (err) { toast.error(err.message || 'Publish failed'); }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white border rounded-3xl p-6">
        <h1 className="text-2xl font-extrabold text-[#00342b] mb-5">Create Forum Post</h1>
        <form onSubmit={submit} className="space-y-4">
          <select className="w-full h-12 border rounded-xl px-4" value={form.type} onChange={(e)=>setForm({...form,type:e.target.value})}>
            <option value="question">Question</option>
            <option value="case_report">Case report</option>
            <option value="image">Image</option>
            <option value="discussion">Discussion</option>
          </select>
          <input className="w-full h-12 border rounded-xl px-4" placeholder="Title" value={form.title} onChange={(e)=>setForm({...form,title:e.target.value})} required />
          <textarea className="w-full min-h-56 border rounded-xl px-4 py-3" placeholder="Write your post" value={form.content} onChange={(e)=>setForm({...form,content:e.target.value})} required />
          <input className="w-full h-12 border rounded-xl px-4" placeholder="Tags separated by comma" value={form.tags} onChange={(e)=>setForm({...form,tags:e.target.value})} />
          <input type="file" accept="image/*" onChange={(e)=>setImage(e.target.files?.[0] || null)} />
          <button className="px-5 py-3 rounded-xl bg-[#00342b] text-white font-semibold">Publish</button>
        </form>
      </div>
    </div>
  );
}
