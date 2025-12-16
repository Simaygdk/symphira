"use client";

import { Heart } from "lucide-react";
import { useLikes } from "@/app/context/LikeContext";

type Props = {
  trackId: string;
  size?: number;
};

export default function LikeButton({ trackId, size = 20 }: Props) {
  const { isLiked, toggleLike } = useLikes();
  const liked = isLiked(trackId);

  return (
    <button
      onClick={() => toggleLike(trackId)}
      className="flex items-center justify-center"
      aria-label="Like track"
    >
      <Heart
        size={size}
        className={
          liked
            ? "fill-purple-500 text-purple-500"
            : "text-white/50 hover:text-white"
        }
      />
    </button>
  );
}
