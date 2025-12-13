"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ManageJobPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Load job details
  useEffect(() => {
    const ref = doc(db, "jobs", id);

    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setJob({ id: snap.id, ...snap.data() });
      }
      setLoading(false);
    });

    return () => unsub();
  }, [id]);

  if (!auth.currentUser) {
    return (
      <main className="min-h-screen text-white flex justify-center items-center">
        Please log in as employer.
      </main>
    );
  }

  if (loading || !job) {
    return (
      <main className="min-h-screen text-white flex justify-center items-center">
        Loading job...
      </main>
    );
  }

  if (job.employerId !== auth.currentUser.uid) {
    return (
      <main className="min-h-screen text-white flex justify-center items-center">
        Unauthorized.
      </main>
    );
  }

  const approveApplicant = async (applicantId: string) => {
    const updatedApplicants = job.applicants.map((a: any) =>
      a.userId === applicantId ? { ...a, status: "approved" } : a
    );

    await updateDoc(doc(db, "jobs", id), {
      applicants: updatedApplicants,
    });
  };

  const rejectApplicant = async (applicantId: string) => {
    const updatedApplicants = job.applicants.map((a: any) =>
      a.userId === applicantId ? { ...a, status: "rejected" } : a
    );

    await updateDoc(doc(db, "jobs", id), {
      applicants: updatedApplicants,
    });
  };

  const deleteJob = async () => {
    await deleteDoc(doc(db, "jobs", id));
    router.push("/dashboard/employer");
  };

  return (
    <main className="min-h-screen text-white px-6 py-16 max-w-3xl mx-auto">

      {/* Header */}
      <h1 className="text-4xl font-bold mb-2">{job.title}</h1>
      <p className="text-white/70">{job.company}</p>
      <p className="text-white/50 text-sm mb-6">{job.location}</p>

      {/* Manage Actions */}
      <div className="flex gap-4 mb-10">
        <Link
          href={`/dashboard/employer/edit-job/${job.id}`}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm"
        >
          Edit Job
        </Link>

        <button
          onClick={deleteJob}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white text-sm"
        >
          Delete Job
        </button>
      </div>

      {/* Applicants Section */}
      <section className="bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-xl">
        <h2 className="text-2xl font-semibold mb-4">Applicants</h2>

        {(!job.applicants || job.applicants.length === 0) && (
          <p className="text-white/50 text-sm">No applicants yet.</p>
        )}

        <div className="flex flex-col gap-4">
          {job.applicants?.map((app: any) => (
            <div
              key={app.userId}
              className="bg-white/10 p-4 rounded-xl border border-white/20"
            >
              <p className="text-lg font-medium">{app.name}</p>
              <p className="text-white/60 text-sm">{app.email}</p>
              <p className="text-white/50 text-sm mt-1">
                Status:{" "}
                <span
                  className={
                    app.status === "approved"
                      ? "text-green-400"
                      : app.status === "rejected"
                      ? "text-red-400"
                      : "text-yellow-300"
                  }
                >
                  {app.status || "pending"}
                </span>
              </p>

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => approveApplicant(app.userId)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white text-sm"
                >
                  Approve
                </button>

                <button
                  onClick={() => rejectApplicant(app.userId)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white text-sm"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </main>
  );
}
