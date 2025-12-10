"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db, storage } from "../../../../lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { Upload, User, Globe, MapPin, Save } from "lucide-react";

export default function MusicianProfilePage() {
  const username = "Simay"; // 🔥 Sonradan Auth ile değişecek

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    avatar: "",
    bio: "",
    country: "",
    city: "",
    instagram: "",
    youtube: "",
    spotify: "",
  });

  // 📌 Profil verisini Firestore'dan çek
  useEffect(() => {
    async function loadProfile() {
      const refDoc = doc(db, "musicians", username);
      const snap = await getDoc(refDoc);

      if (snap.exists()) {
        setProfile(snap.data() as any);
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  // 📌 Avatar yükleme
  async function handleAvatarUpload(e: any) {
    const file = e.target.files?.[0];
    if (!file) return;

    const storageRef = ref(storage, `avatars/${username}.jpg`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    setProfile((p) => ({ ...p, avatar: url }));
  }

  // 📌 Kaydet (Firestore'a yaz)
  async function saveProfile() {
    setSaving(true);

    const refDoc = doc(db, "musicians", username);
    await setDoc(refDoc, profile, { merge: true });

    setSaving(false);
    alert("Profile updated successfully ✓");
  }

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center text-white">
        Loading profile...
      </div>
    );

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0a1f] via-[#1b1035] to-[#3b1560] text-white px-6 py-12">
      <h1 className="text-4xl font-bold text-center text-[#f5d36e] mb-10">
        Musician Profile
      </h1>

      {/* CARD WRAPPER */}
      <div className="max-w-2xl mx-auto bg-white/10 border border-white/20 rounded-3xl p-8 backdrop-blur-xl shadow-xl">

        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <img
            src={
              profile.avatar ||
              "https://ui-avatars.com/api/?name=Musician&background=3b1560&color=f5d36e&size=256"
            }
            alt="Avatar"
            className="w-32 h-32 rounded-full object-cover border border-white/20 shadow-lg"
          />

          <label className="mt-4 flex items-center gap-2 cursor-pointer bg-[#f5d36e]/20 px-4 py-2 rounded-full text-[#f5d36e] hover:bg-[#f5d36e]/30 transition">
            <Upload size={18} />
            Change Avatar
            <input type="file" className="hidden" onChange={handleAvatarUpload} />
          </label>
        </div>

        {/* FORM */}
        <div className="space-y-6">

          {/* Bio */}
          <div>
            <label className="text-sm text-neutral-300">Bio</label>
            <textarea
              className="w-full mt-1 p-3 rounded-xl bg-white/10 border border-white/20 text-white resize-none"
              rows={3}
              value={profile.bio}
              onChange={(e) =>
                setProfile((p) => ({ ...p, bio: e.target.value }))
              }
            />
          </div>

          {/* Country */}
          <div>
            <label className="text-sm text-neutral-300 flex gap-2 items-center">
              <Globe size={16} /> Country
            </label>
            <input
              className="w-full mt-1 p-3 rounded-xl bg-white/10 border border-white/20 text-white"
              value={profile.country}
              onChange={(e) =>
                setProfile((p) => ({ ...p, country: e.target.value }))
              }
              placeholder="Example: Türkiye"
            />
          </div>

          {/* City */}
          <div>
            <label className="text-sm text-neutral-300 flex gap-2 items-center">
              <MapPin size={16} /> City
            </label>
            <input
              className="w-full mt-1 p-3 rounded-xl bg-white/10 border border-white/20 text-white"
              value={profile.city}
              onChange={(e) =>
                setProfile((p) => ({ ...p, city: e.target.value }))
              }
              placeholder="Example: İstanbul"
            />
          </div>

          {/* Social Links */}
          <div>
            <label className="text-sm text-neutral-300">Instagram</label>
            <input
              className="w-full mt-1 p-3 rounded-xl bg-white/10 border border-white/20 text-white"
              value={profile.instagram}
              onChange={(e) =>
                setProfile((p) => ({ ...p, instagram: e.target.value }))
              }
              placeholder="https://instagram.com/username"
            />
          </div>

          <div>
            <label className="text-sm text-neutral-300">YouTube</label>
            <input
              className="w-full mt-1 p-3 rounded-xl bg-white/10 border border-white/20 text-white"
              value={profile.youtube}
              onChange={(e) =>
                setProfile((p) => ({ ...p, youtube: e.target.value }))
              }
              placeholder="https://youtube.com/..."
            />
          </div>

          <div>
            <label className="text-sm text-neutral-300">Spotify</label>
            <input
              className="w-full mt-1 p-3 rounded-xl bg-white/10 border border-white/20 text-white"
              value={profile.spotify}
              onChange={(e) =>
                setProfile((p) => ({ ...p, spotify: e.target.value }))
              }
              placeholder="https://open.spotify.com/artist/..."
            />
          </div>
        </div>

        {/* SAVE BUTTON */}
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={saveProfile}
          disabled={saving}
          className="mt-8 w-full py-3 bg-[#f5d36e]/20 border border-[#f5d36e]/40 rounded-full text-[#f5d36e] hover:bg-[#f5d36e]/30 transition flex items-center justify-center gap-2 font-semibold"
        >
          <Save size={18} />
          {saving ? "Saving..." : "Save Profile"}
        </motion.button>
      </div>
    </main>
  );
}
