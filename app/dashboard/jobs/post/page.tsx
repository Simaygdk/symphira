"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function JobPostPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState("");

  const [posting, setPosting] = useState(false);
  const [success, setSuccess] = useState(false);

  const submit = async () => {
    const user = auth.currentUser;
    if (!user) return;

    if (!title || !company || !location || !description || !salary) {
      alert("Please fill all required fields.");
      return;
    }

    setPosting(true);
    setSuccess(false);

    try {
      await addDoc(collection(db, "jobs"), {
        title,
        company,
        location,
        salary,
        description,
        requirements: requirements
          ? requirements.split(",").map(r => r.trim())
          : [],
        ownerId: user.uid,
        createdAt: serverTimestamp(),
      });

      setSuccess(true);

      setTimeout(() => {
        router.push("/dashboard/jobs/mine");
      }, 800);
    } finally {
      setPosting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-[#2b1650] via-[#140a25] to-black" />
      <div className="absolute -top-32 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-purple-600/20 blur-[160px]" />

      <div className="relative z-10 px-6 py-16">
        <h1 className="text-5xl font-bold text-purple-300 drop-shadow-[0_0_30px_rgba(180,50,255,0.35)]">
          Post a Job
        </h1>

        <p className="text-neutral-300 mt-3 max-w-lg">
          Create a new job listing and reach musicians on Symphira.
        </p>

        <div className="max-w-xl mt-12 space-y-6">
          <input className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20" placeholder="Job Title" onChange={e => setTitle(e.target.value)} />
          <input className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20" placeholder="Company" onChange={e => setCompany(e.target.value)} />
          <input className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20" placeholder="Location" onChange={e => setLocation(e.target.value)} />
          <input className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20" placeholder="Salary" onChange={e => setSalary(e.target.value)} />

          <textarea className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20" rows={4} placeholder="Job Description" onChange={e => setDescription(e.target.value)} />
          <textarea className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20" rows={2} placeholder="Requirements" onChange={e => setRequirements(e.target.value)} />

          <motion.button
            whileTap={{ scale: 0.95 }}
            disabled={posting}
            onClick={submit}
            className="w-full py-3 rounded-xl bg-purple-600/30 border border-purple-400 text-purple-200 hover:bg-purple-600/40 transition"
          >
            {posting ? "Publishing..." : "Publish Job"}
          </motion.button>

          {success && (
            <div className="flex items-center gap-3 text-green-400 bg-white/10 border border-green-500/30 p-4 rounded-xl">
              <CheckCircle size={22} />
              Job posted successfully
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
