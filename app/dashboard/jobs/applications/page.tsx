"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  where,
  doc,
  getDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

type Job = {
  id: string;
  title: string;
};

type Profile = {
  name: string;
  role?: string;
  instrument?: string;
};

type ApplicationView = {
  id: string;
  jobTitle: string;
  applicant: Profile;
};

export default function JobApplicationsPage() {
  const [items, setItems] = useState<ApplicationView[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      const jobsQuery = query(
        collection(db, "jobs"),
        where("ownerId", "==", user.uid)
      );

      const unsubJobs = onSnapshot(jobsQuery, async (jobsSnap) => {
        const jobs: Job[] = jobsSnap.docs.map((d) => ({
          id: d.id,
          title: d.data().title,
        }));

        if (jobs.length === 0) {
          setItems([]);
          setLoading(false);
          return;
        }

        const unsubApps = onSnapshot(
          collection(db, "applications"),
          async (appsSnap) => {
            const list: ApplicationView[] = [];

            for (const appDoc of appsSnap.docs) {
              const data = appDoc.data();
              const job = jobs.find((j) => j.id === data.jobId);
              if (!job) continue;

              const profileSnap = await getDoc(
                doc(db, "profiles", data.applicantId)
              );

              if (!profileSnap.exists()) continue;

              list.push({
                id: appDoc.id,
                jobTitle: job.title,
                applicant: profileSnap.data() as Profile,
              });
            }

            setItems(list);
            setLoading(false);
          }
        );

        return () => unsubApps();
      });

      return () => unsubJobs();
    });

    return () => unsubAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-purple-300">
        Loading...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-neutral-400">
        No applications yet
      </div>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-[#2b1650] via-[#140a25] to-black" />
      <div className="absolute -top-32 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-purple-600/20 blur-[160px]" />

      <div className="relative z-10 px-10 py-16">
        <h1 className="text-4xl font-bold text-purple-300 mb-12">
          Applicants to My Jobs
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-xl"
            >
              <h2 className="text-lg font-semibold text-purple-200">
                {item.jobTitle}
              </h2>

              <div className="mt-4">
                <p className="text-xl font-medium">
                  {item.applicant.name}
                </p>

                {(item.applicant.role || item.applicant.instrument) && (
                  <p className="text-sm text-neutral-300">
                    {item.applicant.role}
                    {item.applicant.instrument
                      ? ` · ${item.applicant.instrument}`
                      : ""}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
