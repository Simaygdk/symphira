"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../../../lib/firebase";

export default function ProfilePage() {
  const { uid } = useParams();
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const q = query(
        collection(db, "posts"),
        where("userId", "==", uid),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      setPosts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    };
    fetchPosts();
  }, [uid]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold text-purple-400 mb-4">
        🎶 {uid ? `Profile: ${uid}` : "Loading..."}
      </h1>
      <p className="text-gray-400 mb-6">
        See all uploads from this Symphira user.
      </p>

      <div className="space-y-6 w-full max-w-2xl">
        {posts.length === 0 ? (
          <p className="text-gray-500 text-center">No uploads yet.</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="bg-zinc-900 p-4 rounded-2xl">
              {post.type === "image" && (
                <img
                  src={post.url}
                  alt="User post"
                  className="rounded-xl mb-3 max-h-[400px] object-contain"
                />
              )}
              {post.type === "video" && (
                <video controls src={post.url} className="rounded-xl mb-3" />
              )}
              {post.type === "audio" && (
                <audio controls src={post.url} className="mb-3 w-full" />
              )}
              <p className="text-gray-300">{post.caption}</p>
              <p className="text-gray-500 text-xs mt-1">
                Uploaded on {new Date(post.createdAt?.toDate()).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
