"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { useAudioPlayer } from "@/app/context/AudioPlayerContext";

interface Post {
  id: string;
  userId: string;
  userName: string;
  caption: string;
  url: string;
  type: string;
  createdAt: any;
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const { playTrack } = useAudioPlayer();

  useEffect(() => {
    // Feed postlarını canlı dinler
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Post, "id">),
      }));
      setPosts(list);
    });

    return () => unsub();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center py-10 pb-32">
      <h1 className="text-3xl font-bold mb-6">🎵 Feed</h1>

      {posts.length === 0 ? (
        <p className="text-gray-400">Henüz paylaşım yok.</p>
      ) : (
        <div className="w-full max-w-xl space-y-6">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-800 p-4 rounded-xl border border-gray-700"
            >
              <p className="text-lg font-semibold">{post.userName}</p>
              <p className="text-gray-300">{post.caption}</p>

              {/* IMAGE */}
              {post.type === "image" && (
                <img
                  src={post.url}
                  alt="post"
                  className="mt-3 w-full rounded-lg object-cover"
                />
              )}

              {/* VIDEO */}
              {post.type === "video" && (
                <video
                  controls
                  src={post.url}
                  className="mt-3 w-full rounded-lg"
                />
              )}

              {/* AUDIO → GLOBAL PLAYER */}
              {post.type === "audio" && (
                <button
                  onClick={() =>
                    playTrack({
                      id: post.id,
                      title: post.caption || "Audio post",
                      artistName: post.userName,
                      coverURL: "/default-cover.png",
                      audioURL: post.url,
                    })
                  }
                  className="mt-4 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-semibold"
                >
                  ▶ Play Audio
                </button>
              )}

              <p className="text-sm text-gray-500 mt-3">
                {post.createdAt?.seconds
                  ? new Date(
                      post.createdAt.seconds * 1000
                    ).toLocaleString()
                  : ""}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
