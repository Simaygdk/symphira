//MVP İÇİ GELİŞTİRİLECEK
"use client";
// Bu componentin tarayıcı tarafında çalışacağını belirtir

import { Heart } from "lucide-react";
// Kalp (like) ikonunu göstermek için kullanılır

import { useLikes } from "@/app/context/LikeContext";
// Beğeni (like) durumunu yöneten global context hook'u

type Props = {
  trackId: string;
  size?: number;
};
// Componentin alacağı props'lar:
// trackId: hangi şarkının beğenileceği
// size: ikon boyutu (opsiyonel)

export default function LikeButton({ trackId, size = 20 }: Props) {
  // Bir şarkı için beğeni butonu oluşturan component

  const { isLiked, toggleLike } = useLikes();
  // Like durumunu kontrol eden ve değiştiren fonksiyonlar

  const liked = isLiked(trackId);
  // Bu şarkı beğenilmiş mi bilgisini alır

  return (
    <button
      onClick={() => toggleLike(trackId)}
      // Butona tıklanınca like durumu değiştirilir

      className="flex items-center justify-center"
      aria-label="Like track"
      // Erişilebilirlik için açıklama
    >
      <Heart
        size={size}
        // Kalp ikonunun boyutu

        className={
          liked
            ? "fill-purple-500 text-purple-500"
            // Beğenilmişse dolu ve mor görünür
            : "text-white/50 hover:text-white"
            // Beğenilmemişse soluk görünür
        }
      />
    </button>
  );
}
