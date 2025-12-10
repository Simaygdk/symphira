"use client";

import { useEffect, useState } from "react";
import { db } from "../../../../../lib/firebase";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { Loader2, Music, User } from "lucide-react";

interface ArtistProfile {
  name: string;
  bio: string;
  avatar?: string;
}

interface Track {
  id: string;
  title: string;
  url: string;
}

export default function ArtistPublicProfile({ params }: { params: { id: string } }) {
  const artistId = params.id;

  const [artist, setArtist] = useState<ArtistProfile | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArtistData = async () => {
      const ref = doc(db, "musicians", artistId);
      const snap = await getDoc(ref);

      if (snap.exists()) setArtist(snap.data() as ArtistProfile);
      else setArtist(null);

      // Load tracks by this musician
      const tracksRef = collection(db, "tracks");
      const q = query(tracksRef, where("artistId", "==", artistId));
      const trackSnaps = await getDocs(q);

      const loadedTracks = trackSnaps.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Track[];

      setTracks(loadedTracks);
      setLoading(false);
    };

    fetchArtistData();
  }, [artistId]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        <Loader2 className="animate-spin" size={34} />
      </main>
    );
  }

  if (!artist) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        <p className="text-lg text-red-400">Artist not found.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-14 bg-gradient-to-b from-[#0a0714] via-[#1c0e2b] to-[#2b1142] text-white">
      {/* Artist Header */}
      <div className="max-w-3xl mx-auto text-center">
        {artist.avatar ? (
          <img
            src={artist.avatar}
            className="w-32 h-32 rounded-full mx-auto border-4 border-purple-300 object-cover"
          />
        ) : (
          <div className="w-32 h-32 rounded-full mx-auto bg-purple-400/20 text-purple-300 flex items-center justify-center border border-purple-300">
            <User size={44} />
          </div>
        )}

        <h1 className="text-4xl mt-4 font-bold text-purple-200">{artist.name}</h1>
        <p className="text-neutral-300 mt-3 max-w-lg mx-auto">{artist.bio}</p>
      </div>

      {/* Tracks Section */}
      <div className="max-w-3xl mx-auto mt-14">
        <h2 className="text-2xl font-semibold mb-6 text-purple-300">Published Tracks</h2>

        {tracks.length === 0 ? (
          <p className="text-neutral-400">This artist has not uploaded any tracks yet.</p>
        ) : (
          <div className="space-y-4">
            {tracks.map((track) => (
              <div
                key={track.id}
                className="p-4 bg-white/10 rounded-xl border border-white/10 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <Music className="text-purple-300" />
                  <p className="text-lg">{track.title}</p>
                </div>

                <audio controls src={track.url} className="w-48" />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
