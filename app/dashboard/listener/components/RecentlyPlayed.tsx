"use client";

import Image from "next/image";
import Link from "next/link";

interface Track {
  id: string;
  title: string;
  artistName: string;
  coverURL?: string;
}

export default function RecentlyPlayed({ items }: { items: Track[] }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">Recently Played</h2>

      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
        {items.slice(0, 10).map((track) => (
          <Link
            key={track.id}
            href={`/dashboard/listener/track/${track.id}`}
            className="min-w-[160px] bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition flex-shrink-0"
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
