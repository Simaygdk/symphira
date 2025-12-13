"use client";

import { useState } from "react";
import { auth, db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function PostJobPage() {
  const router = useRouter();

  // Null-safe existing user
  const user = auth.currentUser;

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState<string[]>([]);
  const [reqInput, setReqInput] = useState("");

  const [loading, setLoading] = useState(false);

  // If user is not logged in
  if (!user) {
    return (
      <main className="min-h-screen text-white flex items-center justify-center">
        Please log in as an employer.
      </main>
    );
  }

  const addRequirement = () => {
    if (reqInput.trim() === "") return;
    setRequirements([...requirements, reqInput.trim()]);
    setReqInput("");
  };

  const submitJob = async () => {
    if (!title || !company || !location) return;

    setLoading(true);

    await addDoc(collection(db, "jobs"), {
      employerId: user.uid,  // <-- NULL-SAFE
      title,
      company,
      location,
      description,
      requirements,
      applicants: [],
      createdAt: Date.now(),
    });

    setLoading(false);

    router.push("/dashboard/employer");
  };

  return (
    <main className="min-h-screen text-white px-6 py-16 max-w-3xl mx-auto">

      <h1 className="text-4xl font-bold mb-10">Post a New Job</h1>

      {/* TITLE */}
      <label className="text-white/70 text-sm">Job Title</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 mb-6 rounded bg-white/10 border border-white/20"
        placeholder="e.g. Lead Guitarist, Vocalist, Producer"
      />

      {/* COMPANY */}
      <label className="text-white/70 text-sm">Company / Band Name</label>
      <input
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="w-full p-3 mb-6 rounded bg-white/10 border border-white/20"
        placeholder="Your band or company name"
      />

      {/* LOCATION */}
      <label className="text-white/70 text-sm">Location</label>
      <input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="w-full p-3 mb-6 rounded bg-white/10 border border-white/20"
        placeholder="e.g. London, Remote, Istanbul"
      />

      {/* DESCRIPTION */}
      <label className="text-white/70 text-sm">Job Description</label>
      <textarea
        rows={6}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-3 mb-6 rounded bg-white/10 border border-white/20"
        placeholder="Describe the job responsibilities, working style, etc..."
      />

      {/* REQUIREMENTS */}
      <label className="text-white/70 text-sm">Requirements</label>
      <div className="flex gap-3 mb-4">
        <input
          value={reqInput}
          onChange={(e) => setReqInput(e.target.value)}
          className="flex-1 p-3 rounded bg-white/10 border border-white/20"
          placeholder="e.g. 5+ years experience"
        />
        <button
          onClick={addRequirement}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white"
        >
          Add
        </button>
      </div>

      <ul className="mb-6 list-disc list-inside text-white/80">
        {requirements.map((req, index) => (
          <li key={index}>{req}</li>
        ))}
      </ul>

      {/* SUBMIT BUTTON */}
      <button
        disabled={loading}
        onClick={submitJob}
        className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white"
      >
        {loading ? "Posting..." : "Post Job"}
      </button>

    </main>
  );
}
