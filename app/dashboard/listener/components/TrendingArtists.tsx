"use client";

import Image from "next/image";
import Link from "next/link";

interface Artist {
  id: string;
  name: string;
  photoURL?: string;
}

export default function TrendingArtists({ artists }: { artists: Artist[] }) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">Trending Artists</h2>

      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
        {artists.slice(0, 10).map((artist) => (
          <Link
            key={artist.id}
            href={`/dashboard/listener/artist/${artist.id}`}
            className="min-w-[140px] flex flex-col items-center bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition flex-shrink-0"
          >
            <div className="w-24 h-24 rounded-full overflow-hidden mb-3">
              <Image
                src={artist.photoURL || "/default-artist.png"}
                width={200}
                height={200}
                alt="artist"
                className="object-cover w-full h-full"
              />
            </div>

            <p className="font-medium text-center truncate">{artist.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
