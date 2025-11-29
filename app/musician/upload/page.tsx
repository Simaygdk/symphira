"use client";
import { useRouter } from "next/navigation";

export default function UploadPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="bg-zinc-900 p-8 rounded-2xl shadow-lg w-[28rem] text-center">
        <h1 className="text-2xl font-bold mb-4 text-purple-400">🎶 Upload Track</h1>
        <p className="text-gray-400 mb-6">
          Share your latest music tracks with the community and reach new fans.
        </p>

        <input
          type="file"
          accept="audio/*"
          className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4
                     file:rounded file:border-0 file:text-sm file:font-semibold
                     file:bg-purple-600 file:text-white hover:file:bg-purple-700"
        />

        <button
          onClick={() => router.push("/musician")}
          className="w-full bg-zinc-700 hover:bg-zinc-600 py-2 rounded mt-4"
        >
          Back to Musician Panel
        </button>
      </div>
    </div>
  );
}
