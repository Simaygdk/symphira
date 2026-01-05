"use client";
// Bu sayfa client componenttir çünkü state, Firebase ve router kullanır.

import { useState } from "react";
// Form alanlarının değerlerini tutmak için state kullanılır.

import { motion } from "framer-motion";
// Butonlara basma animasyonu eklemek için kullanılır.

import { UploadCloud, Image as ImageIcon, CheckCircle } from "lucide-react";
// Arayüzde kullanılan ikonlar.

import { db, auth } from "@/lib/firebase";
// Firestore ve Auth erişimi.

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
// Firestore’a yeni ürün eklemek için gerekli fonksiyonlar.

import { useRouter } from "next/navigation";
// Ürün yüklendikten sonra yönlendirme yapmak için kullanılır.

// Cloudinary ayarları (kapak görseli yükleme)
const CLOUD_NAME = "dmqnvoish";
const UPLOAD_PRESET = "symphira_profile";

// Satıcının seçebileceği ürün kategorileri
const CATEGORIES = [
  "Strings",
  "Percussion",
  "Wind",
  "Electronic",
];

export default function SellerUploadPage() {
  // Sayfa yönlendirmeleri için router
  const router = useRouter();

  // Ürün bilgileri için state’ler
  const [title, setTitle] = useState("");
  // Ürün başlığı

  const [description, setDescription] = useState("");
  // Satıcının yazdığı ürün açıklaması

  const [price, setPrice] = useState("");
  // Ürün fiyatı (string olarak alınıp sonra number’a çevriliyor)

  const [category, setCategory] = useState("");
  // Seçilen kategori

  const [coverFile, setCoverFile] = useState<File | null>(null);
  // Yüklenen kapak görseli

  // Yükleme süreci kontrol state’leri
  const [uploading, setUploading] = useState(false);
  // Yükleme devam ediyor mu?

  const [success, setSuccess] = useState(false);
  // Yükleme başarılı oldu mu?

  // Kapak görselini Cloudinary’ye yükleyen fonksiyon
  const uploadCoverToCloudinary = async (file: File) => {
    const formData = new FormData();
    // Cloudinary file upload için FormData kullanılır

    formData.append("file", file);
    // Yüklenecek dosya

    formData.append("upload_preset", UPLOAD_PRESET);
    // Cloudinary preset bilgisi

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    // Yükleme başarısızsa hata fırlatılır
    if (!res.ok || !data.secure_url) {
      throw new Error("Cover upload failed");
    }

    // Cloudinary’den dönen görsel URL’i
    return data.secure_url as string;
  };

  // Ürün yükleme işlemi
  const handleSubmit = async () => {
    const user = auth.currentUser;
    // Giriş yapan kullanıcı alınır

    if (!user) {
      // Kullanıcı giriş yapmamışsa işlem yapılmaz
      alert("You must be logged in.");
      return;
    }

    // Zorunlu alanlar kontrol edilir
    if (!title || !price || !category || !coverFile) {
      alert("Please fill all required fields.");
      return;
    }

    setUploading(true);
    setSuccess(false);

    try {
      // Kapak görseli Cloudinary’ye yüklenir
      const coverURL = await uploadCoverToCloudinary(coverFile);

      // Ürün Firestore’a kaydedilir
      await addDoc(collection(db, "products"), {
        title,
        description,
        price: Number(price),
        category,
        coverURL,
        sellerId: user.uid,
        createdAt: serverTimestamp(),
      });

      // Başarılı durum
      setSuccess(true);

      // Form sıfırlanır
      setTitle("");
      setDescription("");
      setPrice("");
      setCategory("");
      setCoverFile(null);

      // Kısa gecikmeden sonra ürünler sayfasına yönlendirilir
      setTimeout(() => {
        router.push("/dashboard/seller/products");
      }, 800);
    } catch (err: any) {
      // Hata durumunda kullanıcı bilgilendirilir
      alert(err.message || "Upload failed.");
    } finally {
      // Yükleme durumu kapatılır
      setUploading(false);
    }
  };

  return (
    <main className="min-h-screen px-6 py-16 bg-gradient-to-b from-[#140a25] via-[#1c0f36] to-[#2b1650] text-white">

      {/* Sayfa başlığı */}
      <h1 className="text-4xl font-bold mb-8 text-purple-300">
        Upload Product
      </h1>

      {/* Ürün yükleme formu */}
      <div className="max-w-xl space-y-6">

        {/* Ürün başlığı */}
        <input
          value={title}
          placeholder="Product Title"
          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20"
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Ürün açıklaması */}
        <textarea
          value={description}
          placeholder="Description"
          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20"
          rows={3}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Ürün fiyatı */}
        <input
          value={price}
          placeholder="Price (TL)"
          className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20"
          onChange={(e) => setPrice(e.target.value)}
        />

        {/* Kategori seçimi */}
        <div className="space-y-2">
          <p className="text-sm text-neutral-400">Category</p>
          <div className="flex gap-3 flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-xl border transition ${
                  category === c
                    ? "bg-purple-600/40 border-purple-400 text-purple-200"
                    : "bg-white/5 border-white/20 text-neutral-300 hover:bg-white/10"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Kapak görseli yükleme */}
        <div className="space-y-2">
          <p className="text-sm text-neutral-400">Upload Cover Image</p>
          <label className="flex flex-col items-center justify-center h-40 border border-dashed border-white/30 rounded-xl cursor-pointer bg-white/5">
            <ImageIcon size={32} className="text-purple-300 mb-2" />
            <span className="text-sm text-neutral-300">
              {coverFile ? coverFile.name : "Click to upload cover"}
            </span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
            />
          </label>
        </div>

        {/* Kaydet butonu */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          disabled={uploading}
          onClick={handleSubmit}
          className="w-full py-3 rounded-xl bg-purple-600/30 border border-purple-400 text-purple-200 flex justify-center gap-2"
        >
          <UploadCloud size={20} />
          {uploading ? "Uploading..." : "Upload Product"}
        </motion.button>

        {/* Başarı mesajı */}
        {success && (
          <div className="flex items-center gap-3 text-green-400 bg-white/10 border border-green-500/30 p-4 rounded-xl">
            <CheckCircle size={22} />
            Product saved successfully
          </div>
        )}
      </div>
    </main>
  );
}
