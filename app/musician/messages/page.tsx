"use client";
import { useRouter } from "next/navigation";

export default function MessagesPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="bg-zinc-900 p-8 rounded-2xl shadow-lg w-[28rem] text-center">
        <h1 className="text-2xl font-bold mb-4 text-purple-400">💌 Fan Messages</h1>
        <p className="text-gray-400 mb-6">
          View and reply to messages from your listeners and followers.
        </p>

        <div className="bg-zinc-800 rounded-lg p-4 text-left text-gray-300 h-40 overflow-y-auto">
          <p>No messages yet.</p>
        </div>

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
