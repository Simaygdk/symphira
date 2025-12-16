"use client";

import { X, Play, Pause, SkipBack, SkipForward, Heart } from "lucide-react";
import { useState } from "react";
import LikeButton from "@/app/components/LikeButton";

type Props = {
  open: boolean;
  onClose: () => void;
  trackId: string;
  title?: string;
  artist?: string;
};

export default function FullScreenPlayer({
  open,
  onClose,
  trackId,
  title = "Unknown Track",
  artist = "Unknown Artist"
}: Props) {
  const [playing, setPlaying] = useState(false);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black text-white">
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 via-black to-black" />

      <div className="relative z-10 flex h-full flex-col px-6 py-8">
        <div className="flex items-center justify-between">
          <button onClick={onClose}>
            <X size={28} />
          </button>

          <span className="text-sm text-white/60">
            Now Playing
          </span>

          <div className="w-7" />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="mb-10 h-64 w-64 rounded-2xl bg-white/10 ring-1 ring-white/10" />

          <h1 className="text-2xl font-semibold">
            {title}
          </h1>
          <p className="mt-1 text-white/60">
            {artist}
          </p>
        </div>

        <div className="mb-6 flex items-center justify-center gap-8">
          <button>
            <SkipBack size={26} />
          </button>

          <button
            onClick={() => setPlaying(!playing)}
            className="rounded-full bg-white p-4 text-black"
          >
            {playing ? <Pause size={28} /> : <Play size={28} />}
          </button>

          <button>
            <SkipForward size={26} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <LikeButton trackId={trackId} size={22} />
          <div className="w-6" />
        </div>
      </div>
    </div>
  );
}
