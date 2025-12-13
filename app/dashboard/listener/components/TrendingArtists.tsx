"use client";

import Image from "next/image";
import Link from "next/link";

export default function TrendingArtists({ artists }: { artists: any[] }) {
  if (!artists || artists.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">Trending Artists</h2>

      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
        {artists.map((artist) => (
          <Link
            key={artist.id}
            href={`/dashboard/listener/artist/${artist.id}`}
            className="min-w-[140px] flex-shrink-0 bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition text-center"
          >
            <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-3">
              <Image
                src={artist.photoURL || "/default-artist.png"}
                width={200}
                height={200}
                alt="artist"
                className="object-cover w-full h-full"
              />
            </div>

            <p className="font-medium truncate">{artist.name}</p>
            <p className="text-sm text-white/50 truncate">
              {artist.genre || "Unknown Genre"}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
