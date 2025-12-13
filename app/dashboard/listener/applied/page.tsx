"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import Link from "next/link";

type Job = {
  id: string;
  title: string;
  company: string;
  applicants?: {
    userId: string;
    status?: string;
  }[];
};

export default function AppliedJobsPage() {
  const user = auth.currentUser;

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      const snap = await getDocs(collection(db, "jobs"));

      const allJobs: Job[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }));

      const appliedJobs = allJobs.filter((j) =>
        j.applicants?.some((app) => app.userId === user.uid)
      );

      setJobs(appliedJobs);
      setLoading(false);
    };

    load();
  }, [user]);

  if (!user)
    return (
      <main className="min-h-screen text-white flex justify-center items-center">
        Please log in.
      </main>
    );

  return (
    <main className="min-h-screen text-white px-6 py-16 max-w-3xl mx-auto">

      <h1 className="text-4xl font-bold mb-10">My Applications</h1>

      {loading ? (
        <p>Loading...</p>
      ) : jobs.length === 0 ? (
        <p className="text-white/60">You haven't applied to any jobs yet.</p>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/dashboard/listener/job/${job.id}`}
              className="block bg-white/10 p-4 rounded-xl border border-white/20 hover:bg-white/20 transition"
            >
              <p className="text-xl font-semibold">{job.title}</p>
              <p className="text-white/60">{job.company}</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
