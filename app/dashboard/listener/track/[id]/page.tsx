"use client";

import { useEffect, useState } from "react";
import { db, auth } from "@/lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { Heart, HeartOff, PlayCircle } from "lucide-react";
import { useAudioPlayer } from "@/app/components/AudioPlayerContext";

export default function TrackDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const [track, setTrack] = useState<any>(null);
  const [liked, setLiked] = useState(false);

  const { playTrack } = useAudioPlayer();

  // Load track
  useEffect(() => {
    const loadTrack = async () => {
      const ref = doc(db, "tracks", id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setTrack({ id: snap.id, ...snap.data() });
      }
    };

    loadTrack();
  }, [id]);

  // Check if user liked this track
  useEffect(() => {
    const checkLiked = async () => {
      if (!auth.currentUser || !track) return;

      const ref = doc(db, "likedSongs", `${auth.currentUser.uid}_${track.id}`);
      const snap = await getDoc(ref);

      setLiked(snap.exists());
    };

    checkLiked();
  }, [track]);

  // LIKE / UNLIKE SYSTEM
  const toggleLike = async () => {
    if (!auth.currentUser || !track) return;

    const userId = auth.currentUser.uid;

    const likeRef = doc(db, "likedSongs", `${userId}_${track.id}`);
    const trackRef = doc(db, "tracks", track.id);

    if (liked) {
      // UNLIKE
      await deleteDoc(likeRef);
      await updateDoc(trackRef, { likes: increment(-1) });
      setLiked(false);
    } else {
      // LIKE
      await setDoc(likeRef, {
        userId,
        trackId: track.id,
        coverURL: track.coverURL,
        title: track.title,
        artistName: track.artistName,
        createdAt: Date.now(),
      });

      await updateDoc(trackRef, { likes: increment(1) });
      setLiked(true);
    }
  };

  if (!track)
    return (
      <main className="min-h-screen text-white flex items-center justify-center">
        Loading...
      </main>
    );

  return (
    <main className="min-h-screen text-white px-6 py-16 flex flex-col gap-12">

      {/* HEADER */}
      <section className="flex flex-col md:flex-row items-center gap-10">

        {/* COVER IMAGE */}
        <div className="w-60 h-60 rounded-xl overflow-hidden border border-white/20">
          <Image
            src={track.coverURL || "/default-cover.png"}
            width={400}
            height={400}
            alt="cover"
            className="object-cover w-full h-full"
          />
        </div>

        {/* TRACK INFO */}
        <div className="flex flex-col gap-3">
          <h1 className="text-4xl font-bold">{track.title}</h1>

          <Link
            href={`/dashboard/listener/artist/${track.artistId}`}
            className="text-xl text-white/70 hover:text-white transition"
          >
            {track.artistName}
          </Link>

          <p className="text-white/60 text-sm max-w-xl">
            {track.description || "No description available for this track."}
          </p>

          {/* BUTTONS */}
          <div className="flex gap-4 mt-4">

            {/* PLAY BUTTON */}
            <button
              onClick={() => playTrack(track)}
              className="px-5 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg flex items-center gap-2"
            >
              <PlayCircle size={22} />
              Play
            </button>

            {/* LIKE BUTTON */}
            <button
              onClick={toggleLike}
              className="px-5 py-3 bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 flex items-center gap-2"
            >
              {liked ? (
                <>
                  <HeartOff size={20} className="text-red-400" />
                  Unlike
                </>
              ) : (
                <>
                  <Heart size={20} className="text-white/60" />
                  Like
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* META INFO BLOCKS */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">

        <div className="bg-white/5 p-6 rounded-xl border border-white/10 text-center">
          <p className="text-sm text-white/60">Genre</p>
          <h3 className="text-xl font-semibold mt-1">
            {track.genre || "Unknown"}
          </h3>
        </div>

        <div className="bg-white/5 p-6 rounded-xl border border-white/10 text-center">
          <p className="text-sm text-white/60">Plays</p>
          <h3 className="text-xl font-semibold mt-1">
            {track.plays ?? 0}
          </h3>
        </div>

        <div className="bg-white/5 p-6 rounded-xl border border-white/10 text-center">
          <p className="text-sm text-white/60">Likes</p>
          <h3 className="text-xl font-semibold mt-1">
            {track.likes ?? 0}
          </h3>
        </div>

      </section>
    </main>
  );
}
