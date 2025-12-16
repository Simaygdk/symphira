"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  getDocs,
} from "firebase/firestore";
import LikeButton from "@/app/components/LikeButton";

type Track = {
  id: string;
  trackId: string;
};

export default function PlaylistDetailPage() {
  const params = useParams();
  const playlistId = params.playlistId as string;

  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setTracks([]);
        setLoading(false);
        return;
      }

      const snap = await getDocs(
        collection(
          db,
          "users",
          user.uid,
          "playlists",
          playlistId,
          "tracks"
        )
      );

      const data: Track[] = snap.docs.map((d) => ({
        id: d.id,
        trackId: d.data().trackId,
      }));

      setTracks(data);
      setLoading(false);
    });

    return () => unsub();
  }, [playlistId]);

  const playFromPlaylist = (startIndex: number) => {
    window.dispatchEvent(
      new CustomEvent("symphira:setQueue", {
        detail: {
          queue: tracks.map((t) => ({
            trackId: t.trackId,
            storagePath: `/tracks/${t.trackId}.mp3`,
            title: t.trackId,
            artist: "Unknown Artist",
          })),
          startIndex,
          autoplay: true,
        },
      })
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black p-8 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="px-8 py-12">
        <h1 className="mb-6 text-3xl font-semibold">
          Playlist: {playlistId}
        </h1>

        {tracks.length === 0 && (
          <p className="text-white/50">
            No tracks in this playlist.
          </p>
        )}

        <ul className="space-y-3">
          {tracks.map((t, index) => (
            <li
              key={t.id}
              onClick={() => playFromPlaylist(index)}
              className="flex cursor-pointer items-center justify-between rounded-xl bg-white/5 px-4 py-3 ring-1 ring-white/10 hover:bg-white/10"
            >
              <div className="flex items-center gap-4">
                <span className="w-6 text-sm text-white/40">
                  {index + 1}
                </span>
                <span className="text-white">
                  {t.trackId}
                </span>
              </div>

              <LikeButton trackId={t.trackId} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
