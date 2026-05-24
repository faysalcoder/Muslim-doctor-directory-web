import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAvailableDoctors, getForumComments, getForumPosts, getJobPosts } from "../../api/axios";

export default function YourPosts() {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [replyMap, setReplyMap] = useState({});

  useEffect(() => {
    (async () => {
      const [p, c, j, a] = await Promise.all([
        getForumPosts({ mine: "1" }),
        getForumComments("0", true).catch(() => ({ data: [] })),
        getJobPosts({ mine: "1" }),
        getAvailableDoctors({ mine: "1" }),
      ]);
      const myPosts = p.data || [];
      setPosts(myPosts);
      setComments(c.data || []);
      setJobs(j.data || []);
      setAvailability(a.data || []);

      const replies = {};
      await Promise.all(
        myPosts.map(async (post) => {
          const res = await getForumComments(post.id).catch(() => ({ data: [] }));
          replies[post.id] = res.data || [];
        }),
      );
      setReplyMap(replies);
    })();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      <section className="bg-white border rounded-3xl p-6">
        <h1 className="text-2xl font-extrabold text-[#00342b] mb-4">Your Posts</h1>
        <div className="grid gap-3">
          {posts.map((p) => (
            <div key={p.id} className="border rounded-2xl p-4 space-y-3">
              <Link to={`/forum/${p.id}`} className="block">
                <div className="font-semibold">{p.title}</div>
                <div className="text-sm text-gray-500">
                  {p.type} • {p.comment_count || 0} replies
                </div>
              </Link>
              <div className="space-y-2">
                {(replyMap[p.id] || []).slice(0, 3).map((reply) => (
                  <div key={reply.id} className="rounded-xl bg-gray-50 border p-3">
                    <div className="text-xs uppercase tracking-[0.2em] text-gray-500">
                      {reply.author_name}
                    </div>
                    <div className="text-sm text-gray-700 mt-1">{reply.comment}</div>
                  </div>
                ))}
                {!(replyMap[p.id] || []).length && (
                  <div className="text-sm text-gray-500">No replies yet.</div>
                )}
              </div>
            </div>
          ))}
          {!posts.length && <p className="text-gray-500">No posts yet.</p>}
        </div>
      </section>

      <section className="bg-white border rounded-3xl p-6">
        <h2 className="text-xl font-bold text-[#00342b] mb-4">Your Comments</h2>
        <div className="grid gap-3">
          {comments.map((c) => (
            <div key={c.id} className="border rounded-2xl p-4">
              <div className="text-sm text-gray-500">On post #{c.post_id}</div>
              <div>{c.comment}</div>
            </div>
          ))}
          {!comments.length && <p className="text-gray-500">No comments yet.</p>}
        </div>
      </section>

      <section className="bg-white border rounded-3xl p-6">
        <h2 className="text-xl font-bold text-[#00342b] mb-4">Your Jobs</h2>
        <div className="grid gap-3">
          {jobs.map((j) => (
            <div key={j.id} className="border rounded-2xl p-4">
              <div className="font-semibold">{j.post_name}</div>
              <div className="text-sm text-gray-500">{j.job_location}</div>
            </div>
          ))}
          {!jobs.length && <p className="text-gray-500">No job posts yet.</p>}
        </div>
      </section>

      <section className="bg-white border rounded-3xl p-6">
        <h2 className="text-xl font-bold text-[#00342b] mb-4">Your Availability</h2>
        <div className="grid gap-3">
          {availability.map((a) => (
            <div key={a.id} className="border rounded-2xl p-4">
              <div className="font-semibold">{a.specialty || "Availability profile"}</div>
              <div className="text-sm text-gray-500">{a.location || "No location"}</div>
            </div>
          ))}
          {!availability.length && <p className="text-gray-500">No availability profile yet.</p>}
        </div>
      </section>
    </div>
  );
}
