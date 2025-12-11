"use client";

import Image from "next/image";
import Link from "next/link";

interface SavedItem {
  id: string;
  title: string;
  artistName: string;
  coverURL?: string;
}

export default function SavedItems({ items }: { items: SavedItem[] }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">Saved Items</h2>

      {items.length === 0 && (
        <p className="text-white/50 text-sm">You have no saved items yet.</p>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        {items.map((track) => (
          <Link
            key={track.id}
            href={`/dashboard/listener/track/${track.id}`}
            className="bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition"
          >
            <div className="aspect-square w-full rounded-lg overflow-hidden mb-3">
              <Image
                src={track.coverURL || "/default-cover.png"}
                width={300}
                height={300}
                alt="cover"
                className="object-cover w-full h-full"
              />
            </div>

            <p className="font-medium truncate">{track.title}</p>
            <p className="text-sm text-white/50 truncate">{track.artistName}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
