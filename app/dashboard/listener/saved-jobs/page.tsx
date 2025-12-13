"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import Link from "next/link";

export default function SavedJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "savedJobs"),
      where("userId", "==", auth.currentUser.uid)
    );

    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setJobs(list);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const removeJob = async (id: string) => {
    await deleteDoc(doc(db, "savedJobs", id));
  };

  if (loading) {
    return (
      <main className="min-h-screen text-white flex items-center justify-center">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen text-white px-6 py-16 flex flex-col gap-12">
      <h1 className="text-4xl font-bold">Saved Job Listings</h1>

      {jobs.length === 0 ? (
        <p className="text-neutral-400 text-sm">
          You haven't saved any job listings yet.
        </p>
      ) : (
        <div className="flex flex-col gap-6 max-w-3xl">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-xl"
            >
              <h2 className="text-xl font-semibold mb-1">{job.title}</h2>
              <p className="text-white/60 text-sm mb-1">{job.company}</p>
              <p className="text-white/70 text-sm mb-3">
                {job.location || "Location not specified"}
              </p>

              <div className="flex items-center justify-between">
                <Link
                  href={`/jobs/${job.jobId}`}
                  className="text-purple-300 hover:text-purple-100 text-sm"
                >
                  View Job →
                </Link>

                <button
                  onClick={() => removeJob(job.id)}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
