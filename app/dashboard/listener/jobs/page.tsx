"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  query,
  onSnapshot,
  doc,
  setDoc,
  where,
} from "firebase/firestore";
import Link from "next/link";

export default function JobListingsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Load job listings
  useEffect(() => {
    const q = query(collection(db, "jobs"));

    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setJobs(list);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // Load user's saved jobs
  useEffect(() => {
    if (!auth.currentUser) return;

    const savedRef = query(
      collection(db, "savedJobs"),
      where("userId", "==", auth.currentUser.uid)
    );

    const unsub = onSnapshot(savedRef, (snap) => {
      const saved = snap.docs.map((d) => d.data().jobId);
      setSavedJobs(saved);
    });

    return () => unsub();
  }, []);

  const saveJob = async (jobId: string, title: string, company: string, location: string) => {
    if (!auth.currentUser) return;

    await setDoc(doc(collection(db, "savedJobs")), {
      userId: auth.currentUser.uid,
      jobId,
      title,
      company,
      location,
      createdAt: Date.now(),
    });
  };

  if (loading) {
    return (
      <main className="min-h-screen text-white flex items-center justify-center">
        Loading jobs...
      </main>
    );
  }

  return (
    <main className="min-h-screen text-white px-6 py-16 flex flex-col gap-12">
      <h1 className="text-4xl font-bold">Available Job Listings</h1>

      {jobs.length === 0 ? (
        <p className="text-neutral-400">No job listings found.</p>
      ) : (
        <div className="flex flex-col gap-6 max-w-3xl">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-xl"
            >
              <h2 className="text-xl font-semibold">{job.title}</h2>

              <p className="text-white/60">{job.company}</p>

              <p className="text-white/70 text-sm mt-1 mb-4">
                {job.location || "Unknown location"}
              </p>

              <div className="flex items-center justify-between">
                {/* VIEW JOB */}
                <Link
                  href={`/dashboard/listener/jobs/${job.id}`}
                  className="text-purple-300 hover:text-purple-100 text-sm"
                >
                  View Details →
                </Link>

                {/* SAVE JOB */}
                <button
                  onClick={() =>
                    saveJob(job.id, job.title, job.company, job.location)
                  }
                  disabled={savedJobs.includes(job.id)}
                  className={`text-sm px-4 py-2 rounded-lg border ${
                    savedJobs.includes(job.id)
                      ? "border-green-500 text-green-400"
                      : "border-purple-300 text-purple-200 hover:bg-purple-300/10"
                  }`}
                >
                  {savedJobs.includes(job.id) ? "Saved" : "Save Job"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
