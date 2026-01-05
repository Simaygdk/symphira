"use client";
// Bu sayfa client componenttir çünkü state, event ve Firebase işlemleri içerir.

import { useState } from "react";
// Form alanları ve yükleme durumları için state kullanılır.

import { motion } from "framer-motion";
// Buton tıklama animasyonu için kullanılır.

import {
  UploadCloud,
  Image as ImageIcon,
  Music2,
  CheckCircle,
} from "lucide-react";
// Upload ekranında kullanılan ikonlar.

import { db, auth } from "../../../../lib/firebase";
// Firebase Auth (kullanıcı) ve Firestore erişimi.

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
// Yeni track kaydı oluşturmak için kullanılır.

// Cloudinary ayarları (kapak görseli yüklemek için)
const CLOUD_NAME = "dmqnvoish";
const UPLOAD_PRESET = "symphira_profile";

export default function UploadMusicPage() {
  // Track başlığı
  const [title, setTitle] = useState("");

  // Artist adı (manuel giriliyor)
  const [artistName, setArtistName] = useState("");

  // Kapak görseli dosyası
  const [coverFile, setCoverFile] = useState<File | null>(null);

  // Audio dosyası (UI var ama backend’de kullanılmıyor)
  const [audioFile, setAudioFile] = useState<File | null>(null);

  // Yükleme işlemi sürüyor mu?
  const [uploading, setUploading] = useState(false);

  // Başarıyla kaydedildi mi?
  const [success, setSuccess] = useState(false);

  // Kapak görselini Cloudinary’ye yükler
  const uploadCoverToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    // Cloudinary API çağrısı
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData }
    );

    const data = await res.json();

    // Upload başarısızsa hata fırlatılır
    if (!res.ok || !data.secure_url) {
      throw new Error(data?.error?.message || "Cover upload failed");
    }

    // Yüklenen görselin URL’i döndürülür
    return data.secure_url;
  };

  // Save Track butonuna basıldığında çalışır
  const handleSubmit = async () => {
    const user = auth.currentUser;

    // Kullanıcı giriş yapmamışsa işlem yapılmaz
    if (!user) {
      alert("You must be logged in.");
      return;
    }

    // Zorunlu alanlar kontrol edilir
    if (!title || !artistName || !coverFile) {
      alert("Title, artist and cover image required.");
      return;
    }

    setUploading(true);
    setSuccess(false);

    try {
      // Kapak görseli Cloudinary’ye yüklenir
      const coverURL = await uploadCoverToCloudinary(coverFile);

      // Track bilgileri Firestore’a kaydedilir
      await addDoc(collection(db, "tracks"), {
        title,
        artistName,
        coverURL,
        audioURL: "",
        ownerId: user.uid,
        createdAt: serverTimestamp(),
      });

      // Başarılı kayıt sonrası form sıfırlanır
      setSuccess(true);
      setTitle("");
      setArtistName("");
      setCoverFile(null);
      setAudioFile(null);
    } catch (err: any) {
      // Yükleme sırasında hata olursa uyarı gösterilir
      alert(err.message || "Track upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen px-6 py-16 bg-gradient-to-b from-[#140a25] via-[#1c0f36] to-[#2b1650] text-white">

      {/* Sayfa başlığı */}
      <h1 className="text-4xl font-bold mb-8 text-purple-300">
        Upload Track
      </h1>

      <div className="max-w-xl space-y-6">

        {/* Track başlığı inputu */}
        <input
          value={title}
          placeholder="Track Title"
          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20"
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Artist adı inputu */}
        <input
          value={artistName}
          placeholder="Artist Name"
          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20"
          onChange={(e) => setArtistName(e.target.value)}
        />

        {/* KAPAK GÖRSELİ YÜKLEME */}
        <div className="space-y-2">
          <p className="text-sm text-neutral-400">
            Upload Cover Image
          </p>

          <label className="flex flex-col items-center justify-center h-40 border border-dashed border-white/30 rounded-xl cursor-pointer bg-white/5">
            <ImageIcon size={32} className="text-purple-300 mb-2" />
            <span className="text-sm text-neutral-300">
              {coverFile ? coverFile.name : "Click to upload cover"}
            </span>

            {/* Gizli dosya inputu */}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                setCoverFile(e.target.files?.[0] || null)
              }
            />
          </label>
        </div>

        {/* AUDIO UPLOAD (UI VAR, ZORUNLU DEĞİL) */}
        <div className="space-y-2">
          <p className="text-sm text-neutral-400">
            Upload Audio
          </p>

          <label className="flex flex-col items-center justify-center h-40 border border-dashed border-white/30 rounded-xl cursor-pointer bg-white/5">
            <Music2 size={32} className="text-purple-300 mb-2" />
            <span className="text-sm text-neutral-300">
              {audioFile ? audioFile.name : "Click to upload audio"}
            </span>

            {/* Gizli dosya inputu */}
            <input
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) =>
                setAudioFile(e.target.files?.[0] || null)
              }
            />
          </label>
        </div>

        {/* KAYDET BUTONU */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          disabled={uploading}
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl bg-purple-600/30 border border-purple-400 text-purple-200 flex justify-center gap-2"
        >
          <UploadCloud size={20} />
          {uploading ? "Uploading..." : "Save Track"}
        </motion.button>

        {/* BAŞARI MESAJI */}
        {success && (
          <div className="flex items-center gap-3 text-green-400 bg-white/10 border border-green-500/30 p-4 rounded-xl">
            <CheckCircle size={22} />
            Track saved successfully
          </div>
        )}
      </div>
    </main>
  );
}
