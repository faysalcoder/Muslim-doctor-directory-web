import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { BASE_URL, createForumComment, getForumComments, getForumPost } from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";

export default function ForumDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => { (async () => { const [p,c] = await Promise.all([getForumPost(id), getForumComments(id)]); setPost(p.data); setComments(c.data || []); })(); }, [id]);

  const submit = async (e) => {
    e.preventDefault();
    try { await createForumComment({ post_id: id, comment }); setComment(""); const res = await getForumComments(id); setComments(res.data || []); toast.success("Comment added"); } catch (err) { toast.error(err.message || 'Failed'); }
  };

  if (!post) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/forum" className="text-sm font-semibold text-[#00342b]">← Back to forum</Link>
      <div className="bg-white border rounded-3xl p-6 mt-4">
        <div className="text-xs uppercase tracking-[0.3em] text-gray-500">{post.type}</div>
        <h1 className="text-3xl font-extrabold text-gray-900 mt-2">{post.title}</h1>
        <div className="text-sm text-gray-500 mt-2">By {post.author_name}</div>
        {post.image_url && <img src={post.image_url.startsWith("http") ? post.image_url : `${BASE_URL}${post.image_url}`} alt={post.title} className="mt-5 rounded-2xl w-full object-cover max-h-[420px]" />}
        <div className="prose max-w-none mt-5 whitespace-pre-line text-gray-700">{post.content}</div>
      </div>
      <div className="bg-white border rounded-3xl p-6 mt-6">
        <h2 className="text-xl font-bold text-[#00342b] mb-4">Replies ({comments.length})</h2>
        <div className="space-y-3 mb-6">{comments.map((c) => <div key={c.id} className="border rounded-2xl p-4"><div className="text-sm font-semibold">{c.author_name}</div><div className="text-sm text-gray-500">{c.comment}</div></div>)}</div>
        {user ? <form onSubmit={submit} className="space-y-3"><textarea className="w-full min-h-32 border rounded-2xl p-4" value={comment} onChange={(e)=>setComment(e.target.value)} placeholder="Write your opinion or reply..." required /><button className="px-5 py-3 rounded-xl bg-[#00342b] text-white font-semibold">Post reply</button></form> : <p className="text-gray-500">Login to reply.</p>}
      </div>
    </div>
  );
}
