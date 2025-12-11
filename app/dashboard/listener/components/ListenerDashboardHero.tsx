"use client";

import React from "react";

export default function ListenerDashboardHero() {
  return (
    <section className="w-full flex flex-col gap-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold text-neutral-900">
            Tekrar hoş geldin, Oktay
          </h1>
          <p className="text-neutral-600">
            Dinleme deneyimine kaldığın yerden devam et.
          </p>
        </div>

        <div className="flex gap-3 mt-4 md:mt-0">
          <button className="px-4 py-2 border border-neutral-300 rounded-md text-sm text-neutral-700 hover:bg-neutral-100 transition">
            Keşfet
          </button>
          <button className="px-4 py-2 border border-neutral-300 rounded-md text-sm text-neutral-700 hover:bg-neutral-100 transition">
            Sana Özel
          </button>
          <button className="px-4 py-2 border border-neutral-300 rounded-md text-sm text-neutral-700 hover:bg-neutral-100 transition">
            Top Tracks
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="border border-neutral-200 rounded-lg p-4 bg-white">
          <p className="text-sm text-neutral-600">Beğenilen Parçalar</p>
          <h2 className="text-xl font-medium text-neutral-900 mt-1">12</h2>
        </div>

        <div className="border border-neutral-200 rounded-lg p-4 bg-white">
          <p className="text-sm text-neutral-600">Takip Edilen Müzisyenler</p>
          <h2 className="text-xl font-medium text-neutral-900 mt-1">4</h2>
        </div>

        <div className="border border-neutral-200 rounded-lg p-4 bg-white">
          <p className="text-sm text-neutral-600">Kaydedilen İlanlar</p>
          <h2 className="text-xl font-medium text-neutral-900 mt-1">3</h2>
        </div>
      </div>
    </section>
  );
}
