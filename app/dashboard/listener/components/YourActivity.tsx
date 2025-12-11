"use client";

export default function YourActivity({
  stats,
}: {
  stats: { listens: number; saved: number; artistsFollowed: number };
}) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold">Your Activity</h2>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white/5 p-6 rounded-xl border border-white/10 text-center">
          <p className="text-sm text-white/60">Total Listens</p>
          <h3 className="text-3xl font-semibold mt-1">{stats.listens}</h3>
        </div>

        <div className="bg-white/5 p-6 rounded-xl border border-white/10 text-center">
          <p className="text-sm text-white/60">Saved Tracks</p>
          <h3 className="text-3xl font-semibold mt-1">{stats.saved}</h3>
        </div>

        <div className="bg-white/5 p-6 rounded-xl border border-white/10 text-center">
          <p className="text-sm text-white/60">Artists Followed</p>
          <h3 className="text-3xl font-semibold mt-1">{stats.artistsFollowed}</h3>
        </div>
      </div>
    </section>
  );
}
