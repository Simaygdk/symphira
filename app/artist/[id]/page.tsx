"use client";

import { useEffect, useState } from "react";
import { db, auth } from "../../../lib/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { motion } from "framer-motion";

export default function ArtistPage({ params }: { params: { id: string } }) {
  const { id: artistId } = params;

  const user = auth.currentUser;

  const [artist, setArtist] = useState<any>(null);
  const [tracks, setTracks] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followDocId, setFollowDocId] = useState<string | null>(null);
  const [followersCount, setFollowersCount] = useState(0);

  // Fetch artist profile
  useEffect(() => {
    const ref = doc(db, "musicians", artistId);
    getDoc(ref).then((snap) => {
      if (snap.exists()) setArtist(snap.data());
    });
  }, [artistId]);

  // Fetch artist tracks
  useEffect(() => {
    const q = query(
      collection(db, "tracks"),
      where("artistId", "==", artistId)
    );

    const unsub = onSnapshot(q, (snap) => {
      setTracks(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });

    return () => unsub();
  }, [artistId]);

  // Follow status tracking
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "followers"),
      where("artistId", "==", artistId),
      where("listenerId", "==", user.uid)
    );

    const unsub = onSnapshot(q, (snap) => {
      if (snap.docs.length > 0) {
        setIsFollowing(true);
        setFollowDocId(snap.docs[0].id);
      } else {
        setIsFollowing(false);
        setFollowDocId(null);
      }
    });

    return () => unsub();
  }, [artistId, user]);

  // Followers count
  useEffect(() => {
    const q = query(
      collection(db, "followers"),
      where("artistId", "==", artistId)
    );

    const unsub = onSnapshot(q, (snap) => {
      setFollowersCount(snap.docs.length);
    });

    return () => unsub();
  }, [artistId]);

  const follow = async () => {
    if (!user) return;

    await addDoc(collection(db, "followers"), {
      artistId,
      listenerId: user.uid,
      followedAt: new Date(),
    });
  };

  const unfollow = async () => {
    if (!followDocId) return;

    await deleteDoc(doc(db, "followers", followDocId));
  };

  if (!artist)
    return (
      <div className="text-center text-neutral-400 mt-20">Loading artist…</div>
    );

  return (
    <main className="min-h-screen px-6 py-12 text-white">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-6">
          <img
            src={artist.photoURL || "https://placehold.co/300x300"}
            className="w-40 h-40 object-cover rounded-full border border-white/20"
          />

          <div>
            <h1 className="text-4xl font-bold text-purple-200 mb-2">
              {artist.name}
            </h1>

            <p className="text-neutral-400 text-sm mb-2">
              {followersCount} followers
            </p>

            {isFollowing ? (
              <button
                onClick={unfollow}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl"
              >
                Unfollow
              </button>
            ) : (
              <button
                onClick={follow}
                className="px-4 py-2 bg-purple-500 rounded-xl"
              >
                Follow
              </button>
            )}
          </div>
        </div>

        <h2 className="mt-12 text-xl font-semibold text-purple-200">
          Tracks
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mt-4">
          {tracks.map((track) => (
            <motion.div
              key={track.id}
              className="bg-white/10 p-3 rounded-xl backdrop-blur-xl"
            >
              <img
                src={track.coverURL}
                className="w-full h-32 object-cover rounded-lg"
              />
              <p className="mt-2 text-sm text-purple-200 font-semibold truncate">
                {track.title}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
