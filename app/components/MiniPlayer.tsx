"use client";
// Bu componentin client (tarayıcı) tarafında çalışacağını belirtir

import { useEffect, useRef, useState } from "react";
// React hookları: state, lifecycle ve referans yönetimi için

import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  X,
} from "lucide-react";
// Mini player arayüzünde kullanılan ikonlar

import { addDoc, collection, serverTimestamp } from "firebase/firestore";
// Kullanıcı dinleme aksiyonlarını Firestore’a loglamak için

import { db, auth } from "@/lib/firebase";
// Firebase veritabanı ve authentication nesneleri

type Track = {
  trackId: string;
  storagePath: string;
  title?: string;
  artist?: string;
};
// Player kuyruğunda tutulacak şarkı tip tanımı

type QueuePayload = {
  queue: Track[];
  startIndex?: number;
  autoplay?: boolean;
};
// Dışarıdan MiniPlayer’a gönderilecek kuyruk yapısı

const STATE_KEY = "symphira_player_state";
// Player state’inin localStorage’ta tutulacağı anahtar

export default function MiniPlayer() {
  // Sayfanın alt kısmında sabit duran mini müzik oynatıcı component

  const audioRef = useRef<HTMLAudioElement | null>(null);
  // Aktif olarak kullanılan Audio nesnesini tutar

  const playStartedRef = useRef(false);
  // Aynı şarkı için birden fazla "play" logu atılmasını engeller

  const [queue, setQueue] = useState<Track[]>([]);
  // Çalınacak şarkıların tutulduğu kuyruk

  const [currentIndex, setCurrentIndex] = useState(0);
  // Kuyrukta şu anda çalan şarkının index’i

  const [playing, setPlaying] = useState(false);
  // Şarkı şu an çalıyor mu bilgisini tutar

  const [currentTime, setCurrentTime] = useState(0);
  // Şarkının o anki süresi

  const [duration, setDuration] = useState(0);
  // Şarkının toplam süresi

  const [volume, setVolume] = useState(0.8);
  // Ses seviyesi (0 - 1 arası)

  const [muted, setMuted] = useState(false);
  // Ses kapalı mı bilgisi

  const [shuffle, setShuffle] = useState(false);
  // Shuffle (karışık çalma) modu açık mı

  const [repeat, setRepeat] = useState(false);
  // Repeat (tekrar) modu açık mı

  const [open, setOpen] = useState(true);
  // MiniPlayer açık mı kapalı mı bilgisini tutar

  const current = queue[currentIndex];
  // Şu anda çalan şarkı

  const logEvent = async (
    type: "play" | "pause" | "skip" | "complete"
  ) => {
    // Kullanıcının dinleme aksiyonlarını Firestore’a kaydeder

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
    // Sayfa ilk açıldığında localStorage’tan player state’ini yükler

    const raw = localStorage.getItem(STATE_KEY);
    if (!raw) return;

    try {
      const s = JSON.parse(raw);
      setQueue(s.queue || []);
      setCurrentIndex(s.currentIndex || 0);
      setCurrentTime(s.currentTime || 0);
      setVolume(s.volume ?? 0.8);
      setMuted(s.muted ?? false);
      setShuffle(!!s.shuffle);
      setRepeat(!!s.repeat);
      setPlaying(false);
    } catch {}
  }, []);

  useEffect(() => {
    // Player state her değiştiğinde localStorage’a kaydeder

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
    // Dışarıdan gönderilen kuyruk event’lerini dinler

    const handler = (e: Event) => {
      const d = (e as CustomEvent<QueuePayload>).detail;
      if (!d || !d.queue || d.queue.length === 0) return;

      setQueue(d.queue);
      setCurrentIndex(d.startIndex ?? 0);
      setCurrentTime(0);
      setPlaying(d.autoplay ?? true);
      setOpen(true);
      playStartedRef.current = false;
    };

    window.addEventListener("symphira:setQueue", handler);
    return () => window.removeEventListener("symphira:setQueue", handler);
  }, []);

  useEffect(() => {
    // Şarkı değiştiğinde yeni bir Audio nesnesi oluşturur

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
    // Play / Pause state değişimini yönetir

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
    // Ses seviyesi ve mute ayarlarını uygular

    if (!audioRef.current) return;
    audioRef.current.volume = volume;
    audioRef.current.muted = muted;
  }, [volume, muted]);

  const next = async () => {
    // Bir sonraki şarkıya geçer

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
    // Bir önceki şarkıya geçer

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
    // Şarkının istenilen saniyesine atlar

    if (!audioRef.current) return;
    audioRef.current.currentTime = v;
    setCurrentTime(v);
  };

  if (!current || !open) return null;
  // Çalınacak şarkı yoksa veya player kapalıysa render edilmez

  return (
    // Mini player arayüzü 
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-5xl rounded-3xl bg-gradient-to-r from-purple-900/40 via-black/60 to-purple-900/40 backdrop-blur-xl ring-1 ring-white/10 shadow-2xl">
      <input
        type="range"
        min={0}
        max={duration || 0}
        value={currentTime}
        onChange={(e) => seek(Number(e.target.value))}
        className="w-full accent-purple-500"
      />

      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <p className="text-sm font-medium text-white">
            {current.title || current.trackId}
          </p>
          <p className="text-xs text-white/60">
            {current.artist || "Unknown Artist"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShuffle(!shuffle)}
            className={shuffle ? "text-purple-400" : "text-white/50"}
          >
            <Shuffle size={18} />
          </button>

          <button onClick={prev} className="text-white">
            <SkipBack size={18} />
          </button>

          <button
            onClick={() => setPlaying(!playing)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-500 text-white"
          >
            {playing ? <Pause size={18} /> : <Play size={18} />}
          </button>

          <button onClick={next} className="text-white">
            <SkipForward size={18} />
          </button>

          <button
            onClick={() => setRepeat(!repeat)}
            className={repeat ? "text-purple-400" : "text-white/50"}
          >
            <Repeat size={18} />
          </button>

          <button onClick={() => setMuted(!muted)} className="text-white">
            {muted || volume === 0 ? (
              <VolumeX size={18} />
            ) : (
              <Volume2 size={18} />
            )}
          </button>

          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-20 accent-purple-500"
          />

          <button
            onClick={() => setOpen(false)}
            className="ml-2 text-white/50 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
