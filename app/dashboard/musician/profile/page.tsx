"use client";
// Bu sayfa client componenttir çünkü state, effect ve Firebase kullanır.

import { useEffect, useMemo, useState } from "react";
// Profil verileri ve hesaplamalar için React hook’ları.

import { onAuthStateChanged, User } from "firebase/auth";
// Kullanıcının giriş durumunu dinlemek için kullanılır.

import { auth, db } from "@/lib/firebase";
// Firebase Auth ve Firestore erişimi.

import { doc, getDoc, setDoc } from "firebase/firestore";
// Profil verisini Firestore’dan okumak ve yazmak için.

import { motion } from "framer-motion";
// Butonlara küçük animasyonlar eklemek için.

import { Image } from "lucide-react";
// Profil fotoğrafı değiştirme alanında ikon olarak kullanılır.

// Sayfanın hangi modda olduğunu belirtir
// create: profil yok, ilk kez oluşturulacak
// view: profil var, sadece görüntüleniyor
// edit: profil düzenleniyor
type Mode = "create" | "view" | "edit";

// Cloudinary ayarları (profil fotoğrafı yüklemek için)
const CLOUD_NAME = "dmqnvoish";
const UPLOAD_PRESET = "symphira_profile";

// Sabit seçim listeleri
const GENRES = ["Rock", "Pop", "Jazz", "Electronic", "Classical", "Ambient", "Experimental", "Other"];
const INSTRUMENTS = ["Guitar", "Piano", "Bass", "Drums", "Violin", "Saxophone", "Other"];
const ROLES = ["Vocal", "Producer", "DJ", "Composer", "Songwriter", "Arranger"];
const GENDERS = ["Male", "Female", "Non-binary", "Prefer not to say"];

export default function MusicianProfilePage() {
  // Giriş yapmış kullanıcı bilgisi
  const [authUser, setAuthUser] = useState<User | null>(null);

  // Auth kontrolü tamamlandı mı?
  const [authReady, setAuthReady] = useState(false);

  // Sayfanın mevcut modu
  const [mode, setMode] = useState<Mode>("create");

  // Sayfa yükleniyor mu?
  const [loading, setLoading] = useState(true);

  // Profil kaydedilirken kullanılır (butonu kilitlemek için)
  const [saving, setSaving] = useState(false);

  // Yeni seçilen profil fotoğrafı
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  // Müzisyen profil bilgileri
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

  // Kullanıcının giriş durumunu dinler
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  // Kullanıcı giriş yaptıktan sonra profil Firestore’dan yüklenir
  useEffect(() => {
    if (!authReady || !authUser) return;

    const loadProfile = async () => {
      const snap = await getDoc(doc(db, "profiles", authUser.uid));

      // Profil varsa görüntüleme moduna geçilir
      if (snap.exists()) {
        setProfile(snap.data() as any);
        setMode("view");
      } else {
        // Profil yoksa oluşturma modunda kalır
        setMode("create");
      }

      setLoading(false);
    };

    loadProfile();
  }, [authReady, authUser]);

  // Doğum tarihinden yaş hesaplama
  const age = useMemo(() => {
    if (!profile.birthDate) return null;
    const birth = new Date(profile.birthDate);
    const today = new Date();
    let a = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) a--;
    return a;
  }, [profile.birthDate]);

  // Çoklu seçim alanları için ekle / çıkar işlemi
  const toggleArray = (
    key: "genres" | "instruments" | "roles",
    value: string
  ) => {
    setProfile((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  // Profil fotoğrafını Cloudinary’ye yükler
  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    return data.secure_url as string;
  };

  // Profil kaydetme işlemi
  const handleSave = async () => {
    if (!authUser) return;

    setSaving(true);

    // Yeni fotoğraf seçilmişse yüklenir
    let photoURL = profile.photoURL;
    if (photoFile) {
      photoURL = await uploadToCloudinary(photoFile);
    }

    // Firestore’a yazılacak veri
    const payload = {
      ...profile,
      photoURL,
      updatedAt: Date.now(),
      createdAt: profile.createdAt || Date.now(),
    };

    // Profil Firestore’a kaydedilir
    await setDoc(doc(db, "profiles", authUser.uid), payload);

    setProfile(payload);
    setPhotoFile(null);
    setMode("view");
    setSaving(false);
  };

  // Auth veya profil yüklenmediyse loading gösterilir
  if (!authReady || loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </main>
    );
  }

  // Profil fotoğrafı önizlemesi
  const imagePreview =
    photoFile
      ? URL.createObjectURL(photoFile)
      : profile.photoURL ||
        "https://placehold.co/200x200/000000/FFFFFF/png?text=Artist";

  // Genre / instrument / role chip bileşeni
  const Chips = ({
    list,
    field,
    editable,
  }: {
    list: string[];
    field: "genres" | "instruments" | "roles";
    editable: boolean;
  }) => (
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
      <h1 className="text-4xl font-bold mb-10 text-purple-300">
        Artist Profile
      </h1>

      <div className="max-w-xl space-y-6">
        <div className="flex items-center gap-6">
          <img
            src={imagePreview}
            className="w-32 h-32 rounded-full object-cover border border-white/20"
          />

          {/* Profil fotoğrafı değiştirme */}
          {(mode === "create" || mode === "edit") && (
            <label className="cursor-pointer bg-white/10 border border-white/20 px-4 py-2 rounded-xl flex items-center gap-2">
              <Image size={18} />
              Change Photo
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) =>
                  setPhotoFile(e.target.files?.[0] || null)
                }
              />
            </label>
          )}
        </div>

        {/* CREATE ve EDIT modları */}
        {(mode === "create" || mode === "edit") && (
          <>
            <input
              placeholder="Artist Name"
              value={profile.artistName}
              onChange={(e) =>
                setProfile({ ...profile, artistName: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/20"
            />

            <textarea
              placeholder="Artist Bio"
              rows={4}
              value={profile.bio}
              onChange={(e) =>
                setProfile({ ...profile, bio: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/20 resize-none"
            />

            <input
              type="date"
              value={profile.birthDate}
              onChange={(e) =>
                setProfile({ ...profile, birthDate: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/20"
            />

            <div className="flex flex-wrap gap-2">
              {GENDERS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() =>
                    setProfile({ ...profile, gender: g })
                  }
                  className={`px-3 py-1 rounded-full text-sm border ${
                    profile.gender === g
                      ? "bg-purple-600/40 border-purple-400 text-purple-200"
                      : "bg-black/50 border-white/20 text-white/60"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            <input
              placeholder="Country"
              value={profile.country}
              onChange={(e) =>
                setProfile({ ...profile, country: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/20"
            />

            <input
              placeholder="City"
              value={profile.city}
              onChange={(e) =>
                setProfile({ ...profile, city: e.target.value })
              }
              className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/20"
            />

            <p className="text-sm text-white/50">Genres</p>
            <Chips list={GENRES} field="genres" editable />

            <p className="text-sm text-white/50">Instruments</p>
            <Chips list={INSTRUMENTS} field="instruments" editable />

            <p className="text-sm text-white/50">Roles</p>
            <Chips list={ROLES} field="roles" editable />

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleSave}
              disabled={saving}
              className="mt-6 px-6 py-2 text-sm rounded-lg bg-purple-600/25 border border-purple-400 text-purple-200 hover:bg-purple-600/35 transition"
            >
              {saving ? "Saving..." : "Save Profile"}
            </motion.button>
          </>
        )}

        {/* VIEW modu */}
        {mode === "view" && (
          <>
            <h2 className="text-2xl font-semibold">
              {profile.artistName}
            </h2>

            <p className="text-white/70">{profile.bio}</p>

            <p className="text-sm text-white/60">
              {profile.gender} · {age ? `${age} years old` : ""} ·{" "}
              {profile.city}, {profile.country}
            </p>

            <p className="text-sm text-white/50">Genres</p>
            <Chips list={GENRES} field="genres" editable={false} />

            <p className="text-sm text-white/50">Instruments</p>
            <Chips list={INSTRUMENTS} field="instruments" editable={false} />

            <p className="text-sm text-white/50">Roles</p>
            <Chips list={ROLES} field="roles" editable={false} />

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => setMode("edit")}
              className="mt-6 px-6 py-2 text-sm rounded-lg bg-purple-600/25 border border-purple-400 text-purple-200 hover:bg-purple-600/35 transition"
            >
              Edit Profile
            </motion.button>
          </>
        )}
      </div>
    </main>
  );
}
