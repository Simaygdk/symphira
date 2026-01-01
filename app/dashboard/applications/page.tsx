"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDoc,
  doc,
} from "firebase/firestore";

type Application = {
  id: string;
  jobId: string;
  applicantId: string;
  status: string;
};

type JobMap = Record<string, string>;

export default function JobApplicationsPage() {
  const user = auth.currentUser;

  const [applications, setApplications] = useState<Application[]>([]);
  const [jobTitles, setJobTitles] = useState<JobMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(collection(db, "applications"));

    const unsub = onSnapshot(q, async (snap) => {
      const list: Application[] = [];
      const titles: JobMap = {};

      for (const docSnap of snap.docs) {
        const data = docSnap.data() as Omit<Application, "id">;

        const jobSnap = await getDoc(doc(db, "jobs", data.jobId));
        if (!jobSnap.exists()) continue;

        const job = jobSnap.data();
        if (job.employerId !== user.uid) continue;

        list.push({ id: docSnap.id, ...data });
        titles[data.jobId] = job.title;
      }

      setApplications(list);
      setJobTitles(titles);
      setLoading(false);
    });

    return () => unsub();
  }, [user]);

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        Please log in.
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-purple-300">
        Loading applications...
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-16 bg-gradient-to-b from-[#140a25] via-[#1c0f36] to-[#2b1650] text-white">
      <h1 className="text-4xl font-bold text-purple-300 mb-12">
        Job Applications
      </h1>

      {applications.length === 0 && (
        <p className="text-white/60">
          No applications received yet.
        </p>
      )}

      <div className="space-y-6 max-w-4xl">
        {applications.map((app) => (
          <div
            key={app.id}
            className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-xl"
          >
            <h2 className="text-xl font-semibold text-purple-200">
              {jobTitles[app.jobId]}
            </h2>

            <p className="text-white/60 text-sm mt-1">
              Applicant ID: {app.applicantId}
            </p>

            <p className="mt-4">
              Status:{" "}
              <span
                className={`font-semibold ${
                  app.status === "applied"
                    ? "text-yellow-400"
                    : app.status === "accepted"
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {app.status}
              </span>
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}

