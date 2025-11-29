"use client";
import { useEffect, useState } from "react";
import { db } from "@lib/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

interface Post {
  id: string;
  username: string;
  caption: string;
  url: string;
  type: string;
  createdAt: any;
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // Firestore koleksiyonuna bağlan
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

    // onSnapshot canlı dinleyicisi
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Post[];
      setPosts(newPosts);
    });

    // cleanup (bileşen unmount olunca dinlemeyi durdur)
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold mb-6">🎵 Feed</h1>

      {posts.length === 0 ? (
        <p className="text-gray-400">Henüz paylaşım yok.</p>
      ) : (
        <div className="w-full max-w-xl space-y-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-800 p-4 rounded-xl shadow-md border border-gray-700"
            >
              <p className="text-lg font-semibold">{post.username}</p>
              <p className="text-gray-300">{post.caption}</p>

              {post.url && (
                <img
                  src={post.url}
                  alt="post"
                  className="mt-3 w-full rounded-lg object-cover"
                />
              )}

              <p className="text-sm text-gray-500 mt-2">
                {new Date(post.createdAt?.seconds * 1000).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
