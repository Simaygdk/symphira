"use client";
// Bu sayfanın client (tarayıcı) tarafında çalışacağını belirtir

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// Kart tıklanınca detay sayfasına yönlendirmek için

import { auth, db } from "@/lib/firebase";
// Firebase auth ve Firestore bağlantıları

import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
// Firestore veri okuma ve yazma işlemleri

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary: string;
  ownerId: string;
  ownerName?: string;
};
// İş ilanı tipi

type Application = {
  id: string;
  jobId: string;
  applicantId: string;
};
// Başvuru tipi

export default function JobsMarketPage() {
  // İş ilanlarının listelendiği marketplace sayfası

  const [jobs, setJobs] = useState<Job[]>([]);
  // Tüm iş ilanları

  const [applications, setApplications] = useState<Application[]>([]);
  // Giriş yapan kullanıcının yaptığı başvurular

  const [loading, setLoading] = useState(true);
  // Yüklenme durumu

  const user = auth.currentUser;
  // Giriş yapan kullanıcı

  const router = useRouter();
  // Sayfa yönlendirme hook’u

  useEffect(() => {
    // Jobs collection’ını canlı olarak dinler

    const unsubJobs = onSnapshot(collection(db, "jobs"), (snap) => {
      const list = snap.docs
        .map((doc) => ({
          id: doc.id,
          ...(doc.data() as any),
        }))
        .filter((job) => job.ownerId);
      // ownerId olan geçerli ilanlar alınır

      setJobs(list);
      setLoading(false);
    });

    let unsubApps = () => {};
    // Kullanıcının başvurularını dinlemek için

    if (user) {
      const q = query(
        collection(db, "applications"),
        where("applicantId", "==", user.uid)
      );

      unsubApps = onSnapshot(q, (snap) => {
        const list = snap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as any),
        }));
        setApplications(list);
      });
    }

    return () => {
      unsubJobs();
      unsubApps();
    };
  }, [user]);

  const hasApplied = (jobId: string) =>
    applications.some((a) => a.jobId === jobId);
  // Kullanıcı bu ilana daha önce başvurmuş mu kontrolü

  const apply = async (job: Job) => {
    // Başvuru işlemi

    if (!user) {
      alert("You must be logged in.");
      return;
    }

    if (job.ownerId === user.uid) {
      alert("You cannot apply to your own job.");
      return;
    }

    if (hasApplied(job.id)) {
      alert("You already applied to this job.");
      return;
    }

    await addDoc(collection(db, "applications"), {
      jobId: job.id,
      applicantId: user.uid,
      salaryExpectation: job.salary,
      appliedAt: serverTimestamp(),
    });

    alert("Application sent successfully");
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
      {/* Arka plan efektleri */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2b1650] via-[#140a25] to-black" />
      <div className="absolute -top-32 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-purple-600/20 blur-[160px]" />

      <div className="relative z-10 px-6 py-16">
        <h1 className="text-4xl font-bold text-center text-purple-300 mb-12">
          Job Marketplace
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {jobs.map((job) => {
            const isOwner = user?.uid === job.ownerId;
            const applied = hasApplied(job.id);

            return (
              <div
                key={job.id}
                onClick={() =>
                  router.push(`/dashboard/jobs/${job.id}`)
                }
                className="
                  cursor-pointer
                  bg-white/10 backdrop-blur-xl
                  border border-white/20 rounded-2xl
                  p-6 shadow-[0_0_25px_rgba(150,70,255,0.15)]
                  hover:bg-white/15 transition
                "
              >
                <h2 className="text-xl font-semibold text-purple-200">
                  {job.title}
                </h2>

                <p className="text-neutral-300 text-sm mt-1">
                  {job.company} · {job.location}
                </p>

                <p className="text-neutral-400 text-sm mt-1">
                  Employer: {job.ownerName || "Unknown"}
                </p>

                <p className="text-neutral-400 text-sm mt-3 line-clamp-4">
                  {job.description}
                </p>

                <p className="mt-4 text-purple-300 font-medium">
                  {job.salary}
                </p>

                <button
                  disabled={isOwner || applied}
                  onClick={(e) => {
                    e.stopPropagation();
                    apply(job);
                  }}
                  className={`
                    mt-4 w-full py-2 rounded-xl border transition
                    ${
                      isOwner
                        ? "bg-white/5 border-white/10 text-neutral-500 cursor-not-allowed"
                        : applied
                        ? "bg-green-500/20 border-green-400 text-green-300 cursor-not-allowed"
                        : "bg-purple-600/30 border-purple-400 text-purple-200 hover:bg-purple-600/40"
                    }
                  `}
                >
                  {isOwner
                    ? "Your Job"
                    : applied
                    ? "Applied"
                    : "Apply"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
