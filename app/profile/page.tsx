"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, setDoc } from "firebase/firestore";
import Image from "next/image";

export default function ProfilePage() {
  const user = auth.currentUser;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");

  const [instagram, setInstagram] = useState("");
  const [youtube, setYoutube] = useState("");
  const [spotify, setSpotify] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!user) return;

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();
        setName(data.name || user.displayName || "");
        setBio(data.bio || "");
        setLocation(data.location || "");
        setSkills(data.skills || []);

        setInstagram(data.social?.instagram || "");
        setYoutube(data.social?.youtube || "");
        setSpotify(data.social?.spotify || "");
      } else {
        // First-time profile creation
        await setDoc(ref, {
          name: user.displayName || "",
          email: user.email || "",
          bio: "",
          location: "",
          skills: [],
          social: {},
        });
      }

      setLoading(false);
    };

    load();
  }, [user]);

  const addSkill = () => {
    if (!skillInput.trim()) return;
    setSkills([...skills, skillInput.trim()]);
    setSkillInput("");
  };

  const removeSkill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const saveProfile = async () => {
    if (!user) return;

    setSaving(true);

    await updateDoc(doc(db, "users", user.uid), {
      name,
      bio,
      location,
      skills,
      social: {
        instagram,
        youtube,
        spotify,
      },
    });

    setSaving(false);
  };

  if (!user) {
    return (
      <main className="min-h-screen text-white flex justify-center items-center">
        Please log in.
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen text-white flex justify-center items-center">
        Loading profile...
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-16 text-white max-w-3xl mx-auto">

      <h1 className="text-4xl font-bold mb-10">My Profile</h1>

      {/* NAME */}
      <label className="text-white/70 text-sm">Name</label>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-3 mb-6 rounded bg-white/10 border border-white/20"
      />

      {/* BIO */}
      <label className="text-white/70 text-sm">Bio</label>
      <textarea
        rows={4}
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        className="w-full p-3 mb-6 rounded bg-white/10 border border-white/20"
      />

      {/* LOCATION */}
      <label className="text-white/70 text-sm">Location</label>
      <input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="w-full p-3 mb-6 rounded bg-white/10 border border-white/20"
      />

      {/* SKILLS */}
      <label className="text-white/70 text-sm">Skills</label>
      <div className="flex gap-3 mb-4">
        <input
          value={skillInput}
          onChange={(e) => setSkillInput(e.target.value)}
          className="flex-1 p-3 rounded bg-white/10 border border-white/20"
        />
        <button
          onClick={addSkill}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2 mb-6">
        {skills.map((s, index) => (
          <li
            key={index}
            className="flex justify-between bg-white/10 p-3 rounded border border-white/20"
          >
            {s}
            <button
              onClick={() => removeSkill(index)}
              className="text-red-400 hover:text-red-300"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      {/* SOCIAL */}
      <h2 className="text-2xl font-semibold mt-10 mb-4">Social Links</h2>

      <label className="text-sm text-white/70">Instagram</label>
      <input
        value={instagram}
        onChange={(e) => setInstagram(e.target.value)}
        className="w-full p-3 mb-4 rounded bg-white/10 border border-white/20"
      />

      <label className="text-sm text-white/70">YouTube</label>
      <input
        value={youtube}
        onChange={(e) => setYoutube(e.target.value)}
        className="w-full p-3 mb-4 rounded bg-white/10 border border-white/20"
      />

      <label className="text-sm text-white/70">Spotify</label>
      <input
        value={spotify}
        onChange={(e) => setSpotify(e.target.value)}
        className="w-full p-3 mb-6 rounded bg-white/10 border border-white/20"
      />

      {/* SAVE BUTTON */}
      <button
        onClick={saveProfile}
        disabled={saving}
        className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white"
      >
        {saving ? "Saving..." : "Save Profile"}
      </button>
    </main>
  );
}
