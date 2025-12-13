"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const [job, setJob] = useState<any>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load job detail
  useEffect(() => {
    const loadJob = async () => {
      const ref = doc(db, "jobs", id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setJob({ id: snap.id, ...snap.data() });
      }

      setLoading(false);
    };

    loadJob();
  }, [id]);

  // Check if job is already saved
  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, "savedJobs"),
      where("userId", "==", auth.currentUser.uid),
      where("jobId", "==", id)
    );

    const unsub = onSnapshot(q, (snap) => {
      setIsSaved(!snap.empty);
    });

    return () => unsub();
  }, [id]);

  const saveJob = async () => {
    if (!auth.currentUser || !job) return;

    await setDoc(doc(collection(db, "savedJobs")), {
      userId: auth.currentUser.uid,
      jobId: id,
      title: job.title,
      company: job.company,
      location: job.location,
      createdAt: Date.now(),
    });
  };

  if (loading || !job) {
    return (
      <main className="min-h-screen text-white flex items-center justify-center">
        Loading job details...
      </main>
    );
  }

  return (
    <main className="min-h-screen text-white px-6 py-16 flex flex-col gap-12 max-w-3xl mx-auto">

      {/* Job Title */}
      <section>
        <h1 className="text-4xl font-bold mb-2">{job.title}</h1>
        <p className="text-lg text-white/70">{job.company}</p>
        <p className="text-sm text-white/50 mt-1">{job.location}</p>
      </section>

      {/* Save Button */}
      <div className="flex gap-4">
        <button
          onClick={saveJob}
          disabled={isSaved}
          className={`px-5 py-2 rounded-lg border text-sm ${
            isSaved
              ? "border-green-500 text-green-400"
              : "border-purple-300 text-purple-200 hover:bg-purple-300/10"
          }`}
        >
          {isSaved ? "Saved" : "Save Job"}
        </button>

        <button className="px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 transition text-white text-sm">
          Apply Now
        </button>
      </div>

      {/* Description */}
      <section className="bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-xl leading-7">
        <h2 className="text-xl font-semibold mb-3">Job Description</h2>
        <p className="text-white/80 whitespace-pre-line">
          {job.description || "No description provided."}
        </p>
      </section>

      {/* Requirements */}
      {job.requirements && Array.isArray(job.requirements) && (
        <section className="bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-xl">
          <h2 className="text-xl font-semibold mb-3">Requirements</h2>

          <ul className="list-disc list-inside text-white/80 leading-7">
            {job.requirements.map((req: string, index: number) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </section>
      )}

      {/* Contact */}
      <section className="bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-xl">
        <h2 className="text-xl font-semibold mb-2">Contact</h2>
        <p className="text-white/80">{job.contactEmail || "No contact info"}</p>
      </section>
    </main>
  );
}
