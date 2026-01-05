"use client";
// Bu sayfanın tarayıcı (client) tarafında çalışacağını belirtir

import { useState } from "react";
// Form alanlarındaki verileri tutmak için useState hook’u

import { motion } from "framer-motion";
// Butona basıldığında animasyon efekti vermek için

import { CheckCircle } from "lucide-react";
// Başarılı işlem sonrası gösterilen ikon

import { auth, db } from "@/lib/firebase";
// Firebase authentication ve Firestore bağlantıları

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
// Firestore’a yeni iş ilanı eklemek için gerekli fonksiyonlar

import { useRouter } from "next/navigation";
// İşlem sonrası başka sayfaya yönlendirmek için

export default function JobPostPage() {
  // Yeni iş ilanı oluşturma sayfası

  const router = useRouter();
  // Sayfa yönlendirme işlemleri için

  const [title, setTitle] = useState("");
  // İş ilanı başlığı

  const [company, setCompany] = useState("");
  // Firma / stüdyo adı

  const [location, setLocation] = useState("");
  // İşin yapılacağı konum

  const [salary, setSalary] = useState("");
  // Maaş / ücret bilgisi

  const [description, setDescription] = useState("");
  // İş açıklaması

  const [requirements, setRequirements] = useState("");
  // İş için gereken şartlar (virgülle ayrılmış)

  const [posting, setPosting] = useState(false);
  // İlan gönderiliyor mu bilgisini tutar

  const [success, setSuccess] = useState(false);
  // İlan başarıyla oluşturuldu mu bilgisini tutar

  const submit = async () => {
    // Publish Job butonuna basıldığında çalışan fonksiyon

    const user = auth.currentUser;
    // Giriş yapan kullanıcıyı alır

    if (!user) return;
    // Kullanıcı giriş yapmamışsa işlem yapılmaz

    if (!title || !company || !location || !description || !salary) {
      // Zorunlu alanlar boşsa uyarı verir
      alert("Please fill all required fields.");
      return;
    }

    setPosting(true);
    // Gönderme işlemi başladı

    setSuccess(false);
    // Önceki başarı durumu sıfırlanır

    try {
      // Firestore’a yeni iş ilanı eklenir
      await addDoc(collection(db, "jobs"), {
        title,
        company,
        location,
        salary,
        description,
        requirements: requirements
          ? requirements.split(",").map(r => r.trim())
          : [],
        // Requirements alanı virgülle ayrılmış diziye çevrilir

        ownerId: user.uid,
        // İlanı oluşturan kullanıcının ID’si

        createdAt: serverTimestamp(),
        // İlanın oluşturulma zamanı
      });

      setSuccess(true);
      // İlan başarıyla oluşturuldu bilgisi

      setTimeout(() => {
        // Kısa bir beklemeden sonra
        router.push("/dashboard/jobs/mine");
        // Kullanıcı kendi ilanlarının olduğu sayfaya yönlendirilir
      }, 800);
    } finally {
      setPosting(false);
      // Gönderme işlemi bitti
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      {/* Arka plan gradyan ve efektler */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2b1650] via-[#140a25] to-black" />
      <div className="absolute -top-32 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-purple-600/20 blur-[160px]" />

      <div className="relative z-10 px-6 py-16">
        {/* Sayfa başlığı */}
        <h1 className="text-5xl font-bold text-purple-300 drop-shadow-[0_0_30px_rgba(180,50,255,0.35)]">
          Post a Job
        </h1>

        {/* Açıklama metni */}
        <p className="text-neutral-300 mt-3 max-w-lg">
          Create a new job listing and reach musicians on Symphira.
        </p>

        {/* Form alanları */}
        <div className="max-w-xl mt-12 space-y-6">
          <input
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20"
            placeholder="Job Title"
            onChange={e => setTitle(e.target.value)}
          />

          <input
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20"
            placeholder="Company"
            onChange={e => setCompany(e.target.value)}
          />

          <input
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20"
            placeholder="Location"
            onChange={e => setLocation(e.target.value)}
          />

          <input
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20"
            placeholder="Salary"
            onChange={e => setSalary(e.target.value)}
          />

          <textarea
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20"
            rows={4}
            placeholder="Job Description"
            onChange={e => setDescription(e.target.value)}
          />

          <textarea
            className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20"
            rows={2}
            placeholder="Requirements"
            onChange={e => setRequirements(e.target.value)}
          />

          {/* İlan gönderme butonu */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            disabled={posting}
            onClick={submit}
            className="w-full py-3 rounded-xl bg-purple-600/30 border border-purple-400 text-purple-200 hover:bg-purple-600/40 transition"
          >
            {posting ? "Publishing..." : "Publish Job"}
          </motion.button>

          {/* Başarı mesajı */}
          {success && (
            <div className="flex items-center gap-3 text-green-400 bg-white/10 border border-green-500/30 p-4 rounded-xl">
              <CheckCircle size={22} />
              Job posted successfully
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
