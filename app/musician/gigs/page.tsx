"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../../../lib/firebase";

interface Gig {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  musicianId?: string;
  image?: string;
}

export default function GigsPage() {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const ref = collection(db, "gigs");
        const snapshot = await getDocs(ref);
        const gigList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Gig, "id">),
        }));
        setGigs(gigList);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchGigs();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading gigs...</p>;
  if (gigs.length === 0)
    return <p className="text-center mt-10">No gigs found.</p>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">All Gigs</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {gigs.map((gig) => (
          <div
            key={gig.id}
            className="border rounded-2xl shadow-sm p-4 flex flex-col items-center text-center hover:shadow-md transition"
          >
            {gig.image && (
              <img
                src={gig.image}
                alt={gig.title}
                className="w-full h-40 object-cover rounded-xl mb-4"
              />
            )}
            <h2 className="text-xl font-semibold">{gig.title}</h2>
            <p className="text-gray-500 text-sm">{gig.date}</p>
            <p className="text-gray-600 mt-2">{gig.location}</p>
            <p className="text-gray-700 mt-3 line-clamp-3">{gig.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
