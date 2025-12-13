"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";

export default function FollowButton({ artistId }: { artistId: string }) {
  const user = auth.currentUser;

  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(0);

  // Check if user is following this artist
  useEffect(() => {
    if (!user) return;

    const ref = doc(db, "following", user.uid, "artists", artistId);

    const unsub = onSnapshot(ref, (snap) => {
      setIsFollowing(snap.exists());
    });

    return () => unsub();
  }, [user, artistId]);

  // Load follower count
  useEffect(() => {
    const ref = doc(db, "followers", artistId);

    const unsub = onSnapshot(ref, (snap) => {
      const data = snap.data();
      setFollowerCount(data?.count || 0);
    });

    return () => unsub();
  }, [artistId]);

  const follow = async () => {
    if (!user) return;

    // Add following
    await setDoc(
      doc(db, "following", user.uid, "artists", artistId),
      { followedAt: Date.now() }
    );

    // Update follower count
    await setDoc(
      doc(db, "followers", artistId),
      { count: followerCount + 1 },
      { merge: true }
    );
  };

  const unfollow = async () => {
    if (!user) return;

    // Remove following
    await deleteDoc(doc(db, "following", user.uid, "artists", artistId));

    // Reduce follower count
    await setDoc(
      doc(db, "followers", artistId),
      { count: Math.max(0, followerCount - 1) },
      { merge: true }
    );
  };

  return (
    <div className="flex items-center gap-3 mt-4">
      {isFollowing ? (
        <button
          onClick={unfollow}
          className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 transition"
        >
          Unfollow
        </button>
      ) : (
        <button
          onClick={follow}
          className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 transition"
        >
          Follow
        </button>
      )}

      <span className="text-white/70 text-sm">{followerCount} followers</span>
    </div>
  );
}
