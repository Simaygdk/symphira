"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import FollowButton from "@/app/components/FollowButton";

export default function ArtistProfilePage() {
  const user = auth.currentUser;

  const [artist, setArtist] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArtist = async () => {
      if (!user) return;

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setArtist(snap.data());
      }

      setLoading(false);
    };

    loadArtist();
  }, [user]);

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        Please log in.
      </main>
    );
  }

  if (loading || !artist) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        Loading profile...
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-16 text-white max-w-3xl mx-auto">
      <h1 className="text-4xl font-bold mb-2">{artist.name}</h1>
      <p className="text-white/60 mb-6">{artist.bio}</p>

      <FollowButton artistId={user.uid} />

      <section className="mt-10">
        <h2 className="text-2xl font-semibold mb-4">Skills</h2>
        <ul className="list-disc ml-6 text-white/70 space-y-1">
          {(artist.skills || []).map((skill: string, i: number) => (
            <li key={i}>{skill}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
