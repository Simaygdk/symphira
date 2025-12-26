"use client";

import { useEffect, useMemo, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db, storage } from "@/lib/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { motion } from "framer-motion";
import { Image, Save, Edit } from "lucide-react";

type Mode = "create" | "view" | "edit";

const GENRES = ["Rock", "Pop", "Jazz", "Electronic", "Classical", "Ambient", "Experimental", "Other"];
const INSTRUMENTS = ["Guitar", "Piano", "Bass", "Drums", "Violin", "Saxophone", "Other"];
const ROLES = ["Vocal", "Producer", "DJ", "Composer", "Songwriter", "Arranger"];
const GENDERS = ["Male", "Female", "Non-binary", "Prefer not to say"];

const EMPTY_PROFILE = {
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
};

export default function MusicianProfilePage() {
  const [mounted, setMounted] = useState(false);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [mode, setMode] = useState<Mode>("create");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [profile, setProfile] = useState(EMPTY_PROFILE);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    return onAuthStateChanged(auth, async (user) => {
      setAuthUser(user);

      if (!user) {
        setLoading(false);
        return;
      }

      const snap = await getDoc(doc(db, "profiles", user.uid));

      if (snap.exists()) {
        setProfile(snap.data() as typeof EMPTY_PROFILE);
        setMode("view");
      } else {
        setProfile(EMPTY_PROFILE);
        setMode("create");
      }

      setLoading(false);
    });
  }, [mounted]);

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
    setProfile((p) => ({
      ...p,
      [key]: p[key].includes(value) ? p[key].filter((v) => v !== value) : [...p[key], value],
    }));
  };

  const handleSave = async () => {
    if (!authUser) return;
    setSaving(true);

    let photoURL = profile.photoURL;

    if (photoFile) {
      const photoRef = ref(storage, `profilePhotos/${authUser.uid}`);
      await uploadBytes(photoRef, photoFile);
      photoURL = await getDownloadURL(photoRef);
    }

    const payload = {
      ...profile,
      photoURL,
      createdAt: profile.createdAt || Date.now(),
      updatedAt: Date.now(),
    };

    await setDoc(doc(db, "profiles", authUser.uid), payload);

    setProfile(payload);
    setPhotoFile(null);
    setMode("view");
    setSaving(false);
  };

  if (!mounted || loading) {
    return <main suppressHydrationWarning className="min-h-screen flex items-center justify-center text-white">Loading...</main>;
  }

  const imagePreview = photoFile
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
          className={`px-3 py-1 rounded-full text-sm border ${
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
    <main suppressHydrationWarning className="min-h-screen px-6 py-16 bg-gradient-to-b from-[#120a22] via-[#1b0f33] to-[#2a1448] text-white">
      <h1 className="text-4xl font-bold mb-10 text-purple-300">Artist Profile</h1>

      <div className="max-w-xl space-y-6">
        <div className="flex items-center gap-6">
          <img src={imagePreview} className="w-32 h-32 rounded-full object-cover border border-white/20" />
          {mode !== "view" && (
            <label className="cursor-pointer bg-white/10 border border-white/20 px-4 py-2 rounded-xl flex items-center gap-2">
              <Image size={18} />
              Change Photo
              <input type="file" className="hidden" accept="image/*" onChange={(e) => setPhotoFile(e.target.files?.[0] || null)} />
            </label>
          )}
        </div>

        {(mode === "create" || mode === "edit") && (
          <>
            <input value={profile.artistName} onChange={(e) => setProfile({ ...profile, artistName: e.target.value })} placeholder="Artist Name" className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/20" />
            <textarea value={profile.bio} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} placeholder="Artist Bio" rows={4} className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/20 resize-none" />
            <input type="date" value={profile.birthDate} onChange={(e) => setProfile({ ...profile, birthDate: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/20" />

            <div className="flex flex-wrap gap-2">
              {GENDERS.map((g) => (
                <button key={g} onClick={() => setProfile({ ...profile, gender: g })} className={`px-3 py-1 rounded-full text-sm border ${profile.gender === g ? "bg-purple-600/40 border-purple-400" : "bg-black/50 border-white/20"}`}>
                  {g}
                </button>
              ))}
            </div>

            <input value={profile.country} onChange={(e) => setProfile({ ...profile, country: e.target.value })} placeholder="Country" className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/20" />
            <input value={profile.city} onChange={(e) => setProfile({ ...profile, city: e.target.value })} placeholder="City" className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/20" />

            <Chips list={GENRES} field="genres" editable />
            <Chips list={INSTRUMENTS} field="instruments" editable />
            <Chips list={ROLES} field="roles" editable />

            <motion.button onClick={handleSave} disabled={saving} whileTap={{ scale: 0.95 }} className="w-full py-3 rounded-xl bg-purple-600/30 border border-purple-400">
              <Save size={18} />
              {saving ? "Saving..." : "Save Profile"}
            </motion.button>
          </>
        )}

        {mode === "view" && (
          <>
            <h2 className="text-2xl font-semibold">{profile.artistName}</h2>
            <p className="text-white/70">{profile.bio}</p>
            <p className="text-sm text-white/60">{profile.gender} · {age ? `${age} years old` : ""} · {profile.city}, {profile.country}</p>
            <Chips list={GENRES} field="genres" editable={false} />
            <Chips list={INSTRUMENTS} field="instruments" editable={false} />
            <Chips list={ROLES} field="roles" editable={false} />
            <motion.button onClick={() => setMode("edit")} whileTap={{ scale: 0.95 }} className="w-full py-3 rounded-xl bg-purple-600/30 border border-purple-400">
              <Edit size={18} /> Edit Profile
            </motion.button>
          </>
        )}
      </div>
    </main>
  );
}
