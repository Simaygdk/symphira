//DEAD CODE AMA TUTULACAK LAZIM OLABİLİR
"use client";
// Bu componentin client (tarayıcı) tarafında çalışacağını belirtir

import { motion } from "framer-motion";
// Framer Motion: animasyonlu buton ve hover efektleri için kullanılır

interface NeonBlobProps {
  icon: string;
  label: string;
  sub: string;
  onClick: () => void;
}
// NeonBlob componentine dışarıdan gelecek prop tipleri

export default function NeonBlob({
  icon,
  label,
  sub,
  onClick,
}: NeonBlobProps) {
  // Neon efektli, animasyonlu dashboard kartı componenti

  return (
    <motion.button
      // Hover sırasında kartın hafif büyümesini sağlar
      whileHover={{ scale: 1.05 }}

      // Tıklama sırasında kartın hafif küçülmesini sağlar
      whileTap={{ scale: 0.95 }}

      // Kart tıklandığında dışarıdan verilen fonksiyonu çalıştırır
      onClick={onClick}

      // Kartın genel tasarımı ve neon efektli stilleri
      className="relative w-64 h-48 rounded-3xl bg-gradient-to-br from-purple-600/20 to-pink-600/20 border border-purple-400/30 backdrop-blur-xl flex flex-col items-center justify-center gap-3 text-center hover:shadow-[0_0_40px_rgba(168,85,247,0.6)] transition"
    >
      {/* Kartın üst kısmında gösterilen ikon */}
      <div className="text-4xl">{icon}</div>

      {/* Ana başlık / kart etiketi */}
      <h2 className="text-xl font-semibold text-white">{label}</h2>

      {/* Alt açıklama metni */}
      <p className="text-sm text-white/70">{sub}</p>
    </motion.button>
  );
}
