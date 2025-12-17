"use client";

import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
} from "lucide-react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";

type Track = {
  trackId: string;
  storagePath: string;
  title?: string;
  artist?: string;
};

type QueuePayload = {
  queue: Track[];
  startIndex?: number;
  autoplay?: boolean;
};

const STATE_KEY = "symphira_player_state";

export default function MiniPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playStartedRef = useRef(false);

  const [queue, setQueue] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playing, setPlaying] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);

  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);

  const current = queue[currentIndex];

  const logEvent = async (
    type: "play" | "pause" | "skip" | "complete"
  ) => {
    const user = auth.currentUser;
    if (!user || !current) return;

    await addDoc(collection(db, "trackAnalytics"), {
      userId: user.uid,
      trackId: current.trackId,
      type,
      currentTime,
      duration,
      createdAt: serverTimestamp(),
    });
  };

  useEffect(() => {
    const raw = localStorage.getItem(STATE_KEY);
    if (!raw) return;

    try {
      const s = JSON.parse(raw);
      setQueue(s.queue || []);
      setCurrentIndex(s.currentIndex || 0);
      setCurrentTime(s.currentTime || 0);
      setVolume(s.volume ?? 1);
      setMuted(s.muted ?? false);
      setShuffle(!!s.shuffle);
      setRepeat(!!s.repeat);
      setPlaying(false);
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(
      STATE_KEY,
      JSON.stringify({
        queue,
        currentIndex,
        currentTime,
        volume,
        muted,
        shuffle,
        repeat,
      })
    );
  }, [queue, currentIndex, currentTime, volume, muted, shuffle, repeat]);

  useEffect(() => {
    const handler = (e: Event) => {
      const d = (e as CustomEvent<QueuePayload>).detail;
      if (!d || !d.queue || d.queue.length === 0) return;

      setQueue(d.queue);
      setCurrentIndex(d.startIndex ?? 0);
      setCurrentTime(0);
      setPlaying(d.autoplay ?? true);
      playStartedRef.current = false;
    };

    window.addEventListener("symphira:setQueue", handler);
    return () => window.removeEventListener("symphira:setQueue", handler);
  }, []);

  useEffect(() => {
    if (!current) return;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const audio = new Audio(current.storagePath);
    audioRef.current = audio;

    audio.volume = volume;
    audio.muted = muted;

    const onLoaded = () => {
      setDuration(audio.duration || 0);
      audio.currentTime = currentTime;
    };

    const onTime = () => setCurrentTime(audio.currentTime);

    const onEnded = async () => {
      await logEvent("complete");
      if (repeat) {
        audio.currentTime = 0;
        audio.play();
        return;
      }
      next();
    };

    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);

    if (playing) audio.play();

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
    };
  }, [currentIndex]);

  useEffect(() => {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.play();
      if (!playStartedRef.current) {
        logEvent("play");
        playStartedRef.current = true;
      }
    } else {
      audioRef.current.pause();
      logEvent("pause");
    }
  }, [playing]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
    audioRef.current.muted = muted;
  }, [volume, muted]);

  const next = async () => {
    if (queue.length === 0) return;
    await logEvent("skip");

    let nextIndex = currentIndex + 1;

    if (shuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else if (nextIndex >= queue.length) {
      nextIndex = 0;
    }

    setCurrentIndex(nextIndex);
    setCurrentTime(0);
    setPlaying(true);
    playStartedRef.current = false;
  };

  const prev = async () => {
    if (queue.length === 0) return;
    await logEvent("skip");

    const prevIndex =
      currentIndex - 1 < 0 ? queue.length - 1 : currentIndex - 1;

    setCurrentIndex(prevIndex);
    setCurrentTime(0);
    setPlaying(true);
    playStartedRef.current = false;
  };

  const seek = (v: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = v;
    setCurrentTime(v);
  };

  if (!current) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-black/95 ring-1 ring-white/10">
      <input
        type="range"
        min={0}
        max={duration || 0}
        value={currentTime}
        onChange={(e) => seek(Number(e.target.value))}
        className="w-full accent-purple-500"
      />

      <div className="flex items-center justify-between px-4 py-3">
        <div>
          <p className="text-sm text-white">
            {current.title || current.trackId}
          </p>
          <p className="text-xs text-white/50">
            {current.artist || "Unknown Artist"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShuffle(!shuffle)}
            className={shuffle ? "text-purple-400" : "text-white/60"}
          >
            <Shuffle />
          </button>

          <button onClick={prev} className="text-white">
            <SkipBack />
          </button>

          <button
            onClick={() => setPlaying(!playing)}
            className="text-white"
          >
            {playing ? <Pause /> : <Play />}
          </button>

          <button onClick={next} className="text-white">
            <SkipForward />
          </button>

          <button
            onClick={() => setRepeat(!repeat)}
            className={repeat ? "text-purple-400" : "text-white/60"}
          >
            <Repeat />
          </button>

          <button
            onClick={() => setMuted(!muted)}
            className="text-white"
          >
            {muted || volume === 0 ? <VolumeX /> : <Volume2 />}
          </button>

          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-16 accent-purple-500"
          />
        </div>
      </div>
    </div>
  );
}
