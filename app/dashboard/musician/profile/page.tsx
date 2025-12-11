"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db, storage } from "../../../../lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Image, Save } from "lucide-react";

export default function MusicianProfilePage() {
  const userId = "demoUser"; // Sonradan auth bağlandığında değişecek

  const [profile, setProfile] = useState<any>({
    artistName: "",
    bio: "",
    instagram: "",
    spotify: "",
    youtube: "",
    photoURL: "",
  });

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const refDoc = await getDoc(doc(db, "profiles", userId));
      if (refDoc.exists()) {
        setProfile(refDoc.data());
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);

    let photoURL = profile.photoURL;

    if (photoFile) {
      const photoRef = ref(storage, `profilePhotos/${userId}-${Date.now()}`);
      await uploadBytes(photoRef, photoFile);
      photoURL = await getDownloadURL(photoRef);
    }

    await setDoc(doc(db, "profiles", userId), {
      ...profile,
      photoURL,
    });

    setSaving(false);
    alert("Profile updated!");
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        Loading Profile...
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-16 bg-gradient-to-b from-[#120a22] via-[#1b0f33] to-[#2a1448] text-white">
      
      <h1 className="text-4xl font-bold mb-10 text-purple-300 drop-shadow-[0_0_25px_rgba(180,50,255,0.4)]">
        Artist Profile
      </h1>

      <div className="max-w-xl space-y-6">

        <div className="flex items-center gap-6">
          <img
            src={
              photoFile
                ? URL.createObjectURL(photoFile)
                : profile.photoURL ||
                  "https://placehold.co/200x200/000000/FFFFFF/png?text=Artist"
            }
            className="w-28 h-28 rounded-full object-cover border border-white/20"
          />

          <label className="cursor-pointer bg-white/10 border border-white/20 px-4 py-2 rounded-xl hover:bg-white/20 transition flex items-center gap-2">
            <Image size={20} />
            Upload Photo
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
            />
          </label>
        </div>

        <input
          type="text"
          placeholder="Artist Name"
          value={profile.artistName}
          onChange={(e) =>
            setProfile({ ...profile, artistName: e.target.value })
          }
          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white"
        />

        <textarea
          placeholder="Artist Bio"
          rows={4}
          value={profile.bio}
          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white resize-none"
        />

        <input
          type="text"
          placeholder="Instagram URL"
          value={profile.instagram}
          onChange={(e) =>
            setProfile({ ...profile, instagram: e.target.value })
          }
          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white"
        />

        <input
          type="text"
          placeholder="Spotify URL"
          value={profile.spotify}
          onChange={(e) =>
            setProfile({ ...profile, spotify: e.target.value })
          }
          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white"
        />

        <input
          type="text"
          placeholder="YouTube URL"
          value={profile.youtube}
          onChange={(e) =>
            setProfile({ ...profile, youtube: e.target.value })
          }
          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white"
        />

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 rounded-xl bg-purple-600/30 border border-purple-400 text-purple-200 
          hover:bg-purple-600/40 transition flex items-center justify-center gap-2"
        >
          <Save size={20} />
          {saving ? "Saving..." : "Save Profile"}
        </motion.button>
      </div>
    </main>
  );
}
