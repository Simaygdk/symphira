"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import Link from "next/link";

export default function EmployerDashboardPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "jobs"),
      where("employerId", "==", auth.currentUser.uid)
    );

    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setJobs(list);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  if (!auth.currentUser) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        Please log in.
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        Loading dashboard...
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      {/* BACKGROUND – Seller ile aynı sistem */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2b1650] via-[#140a25] to-black" />
      <div className="absolute -top-32 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-purple-600/20 blur-[160px]" />

      {/* CONTENT */}
      <div className="relative z-10 px-6 py-16 flex flex-col gap-16 max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-purple-200">
          Employer Dashboard
        </h1>

        {/* METRICS */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white/5 p-6 rounded-xl border border-white/10 text-center backdrop-blur-xl">
            <p className="text-sm text-white/60">Active Job Listings</p>
            <h3 className="text-3xl font-semibold mt-1">{jobs.length}</h3>
          </div>

          <div className="bg-white/5 p-6 rounded-xl border border-white/10 text-center backdrop-blur-xl">
            <p className="text-sm text-white/60">Total Applicants</p>
            <h3 className="text-3xl font-semibold mt-1">
              {jobs.reduce(
                (sum, job) => sum + (job.applicants?.length || 0),
                0
              )}
            </h3>
          </div>

          <div className="bg-white/5 p-6 rounded-xl border border-white/10 text-center backdrop-blur-xl">
            <p className="text-sm text-white/60">Company Score</p>
            <h3 className="text-3xl font-semibold mt-1">4.9 ★</h3>
          </div>
        </section>

        {/* ACTION */}
        <Link
          href="/dashboard/employer/post-job"
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-white w-fit"
        >
          Post New Job
        </Link>

        {/* JOB LIST */}
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold">Your Job Listings</h2>

          {jobs.length === 0 && (
            <p className="text-white/60 text-sm">
              You haven’t posted any jobs yet.
            </p>
          )}

          <div className="flex flex-col gap-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-xl"
              >
                <h3 className="text-xl font-semibold">{job.title}</h3>
                <p className="text-white/60">{job.location}</p>
                <p className="text-white/50 text-sm mt-2 mb-4">
                  Applicants: {job.applicants?.length || 0}
                </p>

                <div className="flex items-center gap-4">
                  <Link
                    href={`/dashboard/employer/job/${job.id}`}
                    className="text-purple-300 hover:text-purple-100 text-sm"
                  >
                    Manage →
                  </Link>

                  <Link
                    href={`/dashboard/employer/edit-job/${job.id}`}
                    className="text-blue-300 hover:text-blue-100 text-sm"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
