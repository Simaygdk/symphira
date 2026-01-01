"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
};

export default function MyJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, user => {
      if (!user) {
        setLoading(false);
        return;
      }

      const q = query(
        collection(db, "jobs"),
        where("ownerId", "==", user.uid)
      );

      return onSnapshot(q, snap => {
        const list = snap.docs.map(d => ({
          id: d.id,
          ...(d.data() as any),
        }));

        setJobs(list);
        setLoading(false);
      });
    });

    return () => unsubAuth();
  }, []);

  const remove = async (id: string) => {
    const ok = confirm("Are you sure you want to delete this job?");
    if (!ok) return;

    await deleteDoc(doc(db, "jobs", id));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-purple-300">
        Loading...
      </div>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-[#2b1650] via-[#140a25] to-black" />
      <div className="absolute -top-32 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-purple-600/20 blur-[160px]" />

      <div className="relative z-10 px-10 py-16">
        <h1 className="text-4xl font-bold text-purple-300 mb-12">
          My Job Posts
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {jobs.map(job => (
            <div
              key={job.id}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl"
            >
              <h2 className="text-xl font-semibold text-purple-200">
                {job.title}
              </h2>

              <p className="text-neutral-300 mt-1 text-sm">
                {job.company} · {job.location}
              </p>

              <p className="text-neutral-400 text-sm mt-3 line-clamp-3">
                {job.description}
              </p>

              <button
                onClick={() => remove(job.id)}
                className="mt-6 w-full py-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition"
              >
                Delete Job
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
