"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { Image, Save, Edit } from "lucide-react";

type Mode = "create" | "view" | "edit";

const CLOUD_NAME = "dmqnvoish";
const UPLOAD_PRESET = "symphira_profile";

const GENRES = ["Rock", "Pop", "Jazz", "Electronic", "Classical", "Ambient", "Experimental", "Other"];
const INSTRUMENTS = ["Guitar", "Piano", "Bass", "Drums", "Violin", "Saxophone", "Other"];
const ROLES = ["Vocal", "Producer", "DJ", "Composer", "Songwriter", "Arranger"];
const GENDERS = ["Male", "Female", "Non-binary", "Prefer not to say"];

export default function MusicianProfilePage() {
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [mode, setMode] = useState<Mode>("create");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const [profile, setProfile] = useState({
    artistName: "",
    bio: "",
    birthDate: "",
    gender: "",
    country: "",
    city: "",
    genres: [] as string[],
    instruments: [] as string[],
    roles: [] as string[],
    photoURL: "",
    createdAt: 0,
    updatedAt: 0,
  });

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!authReady || !authUser) return;

    const loadProfile = async () => {
      const snap = await getDoc(doc(db, "profiles", authUser.uid));
      if (snap.exists()) {
        setProfile(snap.data() as any);
        setMode("view");
      } else {
        setMode("create");
      }
      setLoading(false);
    };

    loadProfile();
  }, [authReady, authUser]);

  const age = useMemo(() => {
    if (!profile.birthDate) return null;
    const birth = new Date(profile.birthDate);
    const today = new Date();
    let a = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) a--;
    return a;
  }, [profile.birthDate]);

  const toggleArray = (key: "genres" | "instruments" | "roles", value: string) => {
    setProfile((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data.secure_url as string;
  };

  const handleSave = async () => {
    if (!authUser) return;
    setSaving(true);

    let photoURL = profile.photoURL;

    if (photoFile) {
      photoURL = await uploadToCloudinary(photoFile);
    }

    const payload = {
      ...profile,
      photoURL,
      updatedAt: Date.now(),
      createdAt: profile.createdAt || Date.now(),
    };

    await setDoc(doc(db, "profiles", authUser.uid), payload);

    setProfile(payload);
    setPhotoFile(null);
    setMode("view");
    setSaving(false);
  };

  if (!authReady || loading) {
    return <main className="min-h-screen flex items-center justify-center text-white">Loading...</main>;
  }

  const imagePreview =
    photoFile
      ? URL.createObjectURL(photoFile)
      : profile.photoURL || "https://placehold.co/200x200/000000/FFFFFF/png?text=Artist";

  const Chips = ({ list, field, editable }: { list: string[]; field: "genres" | "instruments" | "roles"; editable: boolean }) => (
    <div className="flex flex-wrap gap-2">
      {list.map((item) => (
        <button
          key={item}
          type="button"
          disabled={!editable}
          onClick={() => toggleArray(field, item)}
          className={`px-3 py-1 rounded-full text-sm border transition ${
            profile[field].includes(item)
              ? "bg-purple-600/40 border-purple-400 text-purple-200"
              : "bg-black/50 border-white/20 text-white/60"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );

  return (
    <main className="min-h-screen px-6 py-16 bg-gradient-to-b from-[#120a22] via-[#1b0f33] to-[#2a1448] text-white">
      <h1 className="text-4xl font-bold mb-10 text-purple-300">Artist Profile</h1>

      <div className="max-w-xl space-y-6">
        <div className="flex items-center gap-6">
          <img src={imagePreview} className="w-32 h-32 rounded-full object-cover border border-white/20" />
          {(mode === "create" || mode === "edit") && (
            <label className="cursor-pointer bg-white/10 border border-white/20 px-4 py-2 rounded-xl flex items-center gap-2">
              <Image size={18} />
              Change Photo
              <input type="file" className="hidden" accept="image/*" onChange={(e) => setPhotoFile(e.target.files?.[0] || null)} />
            </label>
          )}
        </div>

        {(mode === "create" || mode === "edit") && (
          <>
            <input placeholder="Artist Name" value={profile.artistName} onChange={(e) => setProfile({ ...profile, artistName: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/20" />
            <textarea placeholder="Artist Bio" rows={4} value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/20 resize-none" />
            <input type="date" value={profile.birthDate} onChange={(e) => setProfile({ ...profile, birthDate: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/20" />

            <div className="flex flex-wrap gap-2">
              {GENDERS.map((g) => (
                <button key={g} type="button" onClick={() => setProfile({ ...profile, gender: g })} className={`px-3 py-1 rounded-full text-sm border ${profile.gender === g ? "bg-purple-600/40 border-purple-400 text-purple-200" : "bg-black/50 border-white/20 text-white/60"}`}>
                  {g}
                </button>
              ))}
            </div>

            <input placeholder="Country" value={profile.country} onChange={(e) => setProfile({ ...profile, country: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/20" />
            <input placeholder="City" value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/20" />

            <p className="text-sm text-white/50">Genres</p>
            <Chips list={GENRES} field="genres" editable />

            <p className="text-sm text-white/50">Instruments</p>
            <Chips list={INSTRUMENTS} field="instruments" editable />

            <p className="text-sm text-white/50">Roles</p>
            <Chips list={ROLES} field="roles" editable />

            <motion.button whileTap={{ scale: 0.95 }} onClick={handleSave} disabled={saving} className="w-full py-3 rounded-xl bg-purple-600/30 border border-purple-400 text-purple-200">
              <Save size={18} />
              {saving ? "Saving..." : "Save Profile"}
            </motion.button>
          </>
        )}

        {mode === "view" && (
          <>
            <h2 className="text-2xl font-semibold">{profile.artistName}</h2>
            <p className="text-white/70">{profile.bio}</p>
            <p className="text-sm text-white/60">
              {profile.gender} · {age ? `${age} years old` : ""} · {profile.city}, {profile.country}
            </p>

            <p className="text-sm text-white/50">Genres</p>
            <Chips list={GENRES} field="genres" editable={false} />

            <p className="text-sm text-white/50">Instruments</p>
            <Chips list={INSTRUMENTS} field="instruments" editable={false} />

            <p className="text-sm text-white/50">Roles</p>
            <Chips list={ROLES} field="roles" editable={false} />

            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setMode("edit")} className="w-full py-3 rounded-xl bg-purple-600/30 border border-purple-400 text-purple-200">
              <Edit size={18} /> Edit Profile
            </motion.button>
          </>
        )}
      </div>
    </main>
  );
}
