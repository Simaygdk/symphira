"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function EditJobPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();

  const user = auth.currentUser;

  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [requirements, setRequirements] = useState<string[]>([]);
  const [reqInput, setReqInput] = useState("");

  // Fetch job data
  useEffect(() => {
    const loadJob = async () => {
      const ref = doc(db, "jobs", id);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const data = snap.data();

        if (data.employerId !== auth.currentUser?.uid) {
          router.push("/dashboard/employer");
          return;
        }

        setTitle(data.title);
        setCompany(data.company);
        setLocation(data.location);
        setDescription(data.description);
        setRequirements(data.requirements || []);
      }

      setLoading(false);
    };

    loadJob();
  }, [id, router]);

  if (!user) {
    return (
      <main className="min-h-screen text-white flex justify-center items-center">
        Please log in as employer.
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen text-white flex justify-center items-center">
        Loading job...
      </main>
    );
  }

  const addRequirement = () => {
    if (!reqInput.trim()) return;
    setRequirements([...requirements, reqInput.trim()]);
    setReqInput("");
  };

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  const saveChanges = async () => {
    await updateDoc(doc(db, "jobs", id), {
      title,
      company,
      location,
      description,
      requirements,
    });

    router.push(`/dashboard/employer/job/${id}`);
  };

  return (
    <main className="min-h-screen text-white px-6 py-16 max-w-3xl mx-auto">

      <h1 className="text-4xl font-bold mb-10">Edit Job</h1>

      {/* TITLE */}
      <label className="text-white/70 text-sm">Job Title</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-3 mb-6 rounded bg-white/10 border border-white/20"
      />

      {/* COMPANY */}
      <label className="text-white/70 text-sm">Company / Band Name</label>
      <input
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        className="w-full p-3 mb-6 rounded bg-white/10 border border-white/20"
      />

      {/* LOCATION */}
      <label className="text-white/70 text-sm">Location</label>
      <input
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="w-full p-3 mb-6 rounded bg-white/10 border border-white/20"
      />

      {/* DESCRIPTION */}
      <label className="text-white/70 text-sm">Job Description</label>
      <textarea
        rows={6}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-3 mb-6 rounded bg-white/10 border border-white/20"
      />

      {/* REQUIREMENTS */}
      <label className="text-white/70 text-sm">Requirements</label>

      {/* Add New Requirement */}
      <div className="flex gap-3 mb-4">
        <input
          value={reqInput}
          onChange={(e) => setReqInput(e.target.value)}
          className="flex-1 p-3 rounded bg-white/10 border border-white/20"
          placeholder="Add new requirement..."
        />
        <button
          onClick={addRequirement}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded text-white"
        >
          Add
        </button>
      </div>

      {/* Existing requirements list */}
      <ul className="space-y-2 mb-6">
        {requirements.map((req, index) => (
          <li
            key={index}
            className="flex justify-between items-center bg-white/10 p-3 rounded border border-white/20"
          >
            <span>{req}</span>
            <button
              onClick={() => removeRequirement(index)}
              className="text-red-400 hover:text-red-300"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      {/* Save button */}
      <button
        onClick={saveChanges}
        className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg text-white"
      >
        Save Changes
      </button>

    </main>
  );
}
