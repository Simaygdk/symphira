"use client";
// Bu sayfanın tarayıcı (client) tarafında çalışacağını belirtir

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
// URL'den jobId parametresini almak için

import { auth, db } from "@/lib/firebase";
// Firebase auth ve Firestore bağlantıları

import {
  doc,
  getDoc,
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
// Firestore işlemleri

type Job = {
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
  applicantId: string;
  appliedAt: any;
};
// Başvuru tipi

export default function JobDetailPage() {
  // Tekil iş ilanı detay sayfası

  const { jobId } = useParams<{ jobId: string }>();
  // URL'den jobId alınır

  const user = auth.currentUser;
  // Giriş yapan kullanıcı

  const [job, setJob] = useState<Job | null>(null);
  // İlan bilgileri

  const [applications, setApplications] = useState<Application[]>([]);
  // Bu ilana yapılan başvurular

  const [hasApplied, setHasApplied] = useState(false);
  // Kullanıcı bu ilana daha önce başvurmuş mu

  const [loading, setLoading] = useState(true);
  // Yüklenme durumu

  useEffect(() => {
    // İlan bilgilerini çeker

    const loadJob = async () => {
      const snap = await getDoc(doc(db, "jobs", jobId));
      if (!snap.exists()) {
        setLoading(false);
        return;
      }

      setJob(snap.data() as Job);
      setLoading(false);
    };

    loadJob();
  }, [jobId]);

  useEffect(() => {
    // Bu ilana yapılan başvuruları dinler

    const q = query(
      collection(db, "applications"),
      where("jobId", "==", jobId)
    );

    const unsub = onSnapshot(q, (snap) => {
      const list: Application[] = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as any),
      }));

      setApplications(list);

      if (user) {
        setHasApplied(list.some((a) => a.applicantId === user.uid));
      }
    });

    return () => unsub();
  }, [jobId, user]);

  const apply = async () => {
    // İş ilanına başvuru işlemi

    if (!user || !job) return;

    if (job.ownerId === user.uid) {
      alert("You cannot apply to your own job.");
      return;
    }

    if (hasApplied) {
      alert("You already applied to this job.");
      return;
    }

    await addDoc(collection(db, "applications"), {
      jobId,
      applicantId: user.uid,
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

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-400">
        Job not found.
      </div>
    );
  }

  const isOwner = user?.uid === job.ownerId;
  // Giriş yapan kullanıcı ilan sahibi mi

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      {/* Arka plan */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2b1650] via-[#140a25] to-black" />
      <div className="absolute -top-32 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-purple-600/20 blur-[160px]" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-16">
        {/* İlan bilgileri */}
        <h1 className="text-4xl font-bold text-purple-300">
          {job.title}
        </h1>

        <p className="text-neutral-300 mt-2">
          {job.company} · {job.location}
        </p>

        <p className="text-neutral-400 mt-1">
          Employer: {job.ownerName || "Unknown"}
        </p>

        <p className="mt-6 text-neutral-200 leading-relaxed">
          {job.description}
        </p>

        <p className="mt-6 text-purple-300 font-semibold">
          Salary: {job.salary}
        </p>

        {/* Apply butonu – sadece iş arayan görür */}
        {!isOwner && (
          <button
            disabled={hasApplied}
            onClick={apply}
            className={`
              mt-8 w-full py-3 rounded-xl border transition
              ${
                hasApplied
                  ? "bg-green-500/20 border-green-400 text-green-300 cursor-not-allowed"
                  : "bg-purple-600/30 border-purple-400 text-purple-200 hover:bg-purple-600/40"
              }
            `}
          >
            {hasApplied ? "Applied" : "Apply"}
          </button>
        )}

        {/* Başvuranlar listesi – sadece işveren görür */}
        {isOwner && (
          <div className="mt-12">
            <h2 className="text-2xl font-semibold text-purple-200 mb-4">
              Applications
            </h2>

            {applications.length === 0 ? (
              <p className="text-neutral-400">
                No applications yet.
              </p>
            ) : (
              <div className="space-y-3">
                {applications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white/10 border border-white/20 rounded-xl p-4"
                  >
                    <p className="text-sm text-white/80">
                      Applicant ID: {app.applicantId}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
