"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { db } from "../../../../lib/firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { ChevronDown, MapPin } from "lucide-react";

export default function MusicianOffersPage() {
  const [offers, setOffers] = useState<any[]>([]);

  // Filters
  const [countries, setCountries] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");

  // ------------------------------------------
  // 1) Fetch Countries (REST Countries API)
  // ------------------------------------------
  useEffect(() => {
    const fetchCountries = async () => {
      const res = await fetch("https://restcountries.com/v3.1/all");
      const data = await res.json();

      // Ülke adını ve countryCode'u çıkartalım
      const list = data
        .map((c: any) => ({
          name: c.name.common,
          code: c.cca2,
        }))
        .sort((a: any, b: any) => a.name.localeCompare(b.name));

      setCountries(list);
    };

    fetchCountries();
  }, []);

  // ------------------------------------------
  // 2) Fetch Cities when country changes
  // ------------------------------------------
  useEffect(() => {
    if (!selectedCountry) {
      setCities([]);
      return;
    }

    const fetchCities = async () => {
      const res = await fetch(
        `https://wft-geo-db.p.rapidapi.com/v1/geo/countries/${selectedCountry}/cities?limit=50`,
        {
          method: "GET",
          headers: {
            "X-RapidAPI-Key": "demo", // istersen key ekleyebilirsin, demosu çalışır
            "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
          },
        }
      );

      const data = await res.json();
      const cityList = data.data?.map((c: any) => c.city) || [];

      setCities(cityList);
    };

    fetchCities();
  }, [selectedCountry]);

  // ------------------------------------------
  // 3) Firestore Filtering
  // ------------------------------------------
  useEffect(() => {
    const filters: any[] = [];

    if (selectedCountry) {
      filters.push(where("country", "==", selectedCountry));
    }

    if (selectedCity) {
      filters.push(where("city", "==", selectedCity));
    }

    const q = query(
      collection(db, "offers"),
      ...filters,
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOffers(items);
    });

    return () => unsub();
  }, [selectedCountry, selectedCity]);

  // ------------------------------------------
  // UI
  // ------------------------------------------
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0a0a1f] via-[#1b1035] to-[#3b1560] text-white px-6 py-16">
      <h1 className="text-5xl font-bold text-center text-[#f5d36e] drop-shadow-lg">
        Offers For You
      </h1>

      <p className="text-center text-neutral-300 mt-3">
        Filter offers by country & city
      </p>

      {/* FILTER CARD */}
      <div className="max-w-4xl mx-auto mt-10 p-6 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-xl shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          {/* Country Dropdown */}
          <div>
            <label className="text-sm text-neutral-300 mb-1 block">Country</label>
            <div className="relative">
              <select
                onChange={(e) => {
                  setSelectedCountry(e.target.value);
                  setSelectedCity("");
                }}
                className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white appearance-none"
              >
                <option value="">All Countries</option>
                {countries.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 text-white/50" />
            </div>
          </div>

          {/* City Dropdown */}
          <div>
            <label className="text-sm text-neutral-300 mb-1 block">City</label>
            <div className="relative">
              <select
                disabled={!selectedCountry}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white appearance-none disabled:opacity-40"
              >
                <option value="">All Cities</option>
                {cities.map((city: string) => (
                  <option key={city}>{city}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 text-white/50" />
            </div>
          </div>

        </div>
      </div>

      {/* RESULTS LIST */}
      <div className="max-w-5xl mx-auto mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.length === 0 ? (
          <p className="col-span-full text-center text-neutral-400 italic">
            No offers found for selected filters.
          </p>
        ) : (
          offers.map((offer) => (
            <motion.div
              key={offer.id}
              whileHover={{ scale: 1.03 }}
              className="p-6 bg-white/10 border border-white/20 rounded-2xl backdrop-blur-xl shadow-lg transition"
            >
              <h3 className="text-xl text-[#f5d36e] font-semibold mb-2">
                {offer.title}
              </h3>

              <p className="text-neutral-300 text-sm mb-3 line-clamp-2">
                {offer.description}
              </p>

              <p className="text-neutral-400 text-sm flex items-center gap-2 mb-1">
                <MapPin size={14} /> {offer.city}, {offer.country}
              </p>

              <p className="text-neutral-200 text-sm mt-2">
                Budget: {offer.budget}
              </p>
            </motion.div>
          ))
        )}
      </div>
    </main>
  );
}
