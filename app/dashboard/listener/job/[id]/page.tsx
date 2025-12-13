"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function JobDetailsPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const user = auth.currentUser;
  const router = useRouter();

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const load = async () => {
      const ref = doc(db, "jobs", id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setJob({ id: snap.id, ...snap.data() });
      }

      setLoading(false);
    };

    load();
  }, [id]);

  const applyToJob = async () => {
    if (!user) return;

    setApplying(true);

    const ref = doc(db, "jobs", id);

    const snap = await getDoc(ref);
    if (!snap.exists()) return;

    const data = snap.data();

    const alreadyApplied = data.applicants?.some(
      (a: any) => a.userId === user.uid
    );

    if (alreadyApplied) {
      setApplying(false);
      return;
    }

    const newApplicant = {
      userId: user.uid,
      name: user.displayName || "Unknown User",
      email: user.email || "No Email",
      status: "pending",
      appliedAt: Date.now(),
    };

    await updateDoc(ref, {
      applicants: [...(data.applicants || []), newApplicant],
    });

    setApplying(false);

    router.push("/dashboard/listener/applied");
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        Loading job...
      </main>
    );
  }

  if (!job) {
    return (
      <main className="min-h-screen flex items-center justify-center text-white">
        Job not found.
      </main>
    );
  }

  return (
    <main className="min-h-screen text-white px-6 py-16 max-w-3xl mx-auto">

      <h1 className="text-4xl font-bold mb-2">{job.title}</h1>
      <p className="text-purple-300 text-lg">{job.company}</p>
      <p className="text-white/60 mb-6">{job.location}</p>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">Description</h2>
        <p className="text-white/70 leading-relaxed">{job.description}</p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-3">Requirements</h2>
        <ul className="list-disc list-inside text-white/70">
          {job.requirements?.map((r: string, i: number) => (
            <li key={i}>{r}</li>
          ))}
        </ul>
      </section>

      {/* APPLY BUTTON */}
      <button
        disabled={applying}
        onClick={applyToJob}
        className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white text-lg"
      >
        {applying ? "Applying..." : "Apply Now"}
      </button>
    </main>
  );
}
