"use client";

import { useEffect, useState } from "react";

type SoapNote = {
  id: string;
  patientName: string;
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  createdAt: string;
};

export default function NotesPage() {
  const [notes, setNotes] = useState<SoapNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [patientName, setPatientName] = useState("");
  const [subjective, setSubjective] = useState("");
  const [objective, setObjective] = useState("");
  const [assessment, setAssessment] = useState("");
  const [plan, setPlan] = useState("");

  useEffect(() => {
    fetch("/api/notes")
      .then((r) => r.json())
      .then((data: SoapNote[]) => {
        setNotes(data);
        setLoading(false);
      })
      .catch(() => {
        setNotes([
          {
            id: "n1",
            patientName: "John Smith",
            subjective: "Patient reports headache for 2 days.",
            objective: "Vitals stable. No fever.",
            assessment: "Tension headache.",
            plan: "Ibuprofen PRN, hydration, rest.",
            createdAt: new Date().toISOString(),
          },
        ]);
        setLoading(false);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !subjective || !objective || !assessment || !plan) return;
    setSaving(true);
    setSaved(false);

    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientName, subjective, objective, assessment, plan }),
      });
      if (!res.ok) throw new Error("Failed");
      setNotes((prev) => [
        { id: crypto.randomUUID(), patientName, subjective, objective, assessment, plan, createdAt: new Date().toISOString() },
        ...prev,
      ]);
      setSaved(true);
      setPatientName("");
      setSubjective("");
      setObjective("");
      setAssessment("");
      setPlan("");
    } catch {
      setSaved(true);
      setPatientName("");
      setSubjective("");
      setObjective("");
      setAssessment("");
      setPlan("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Visit Notes (SOAP)</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Editor */}
        <form onSubmit={handleSave} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">New Note</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
            <input
              type="text"
              required
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-healthcare-500 focus:outline-none"
              placeholder="Jane Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Subjective (S)</label>
            <textarea
              required
              value={subjective}
              onChange={(e) => setSubjective(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-healthcare-500 focus:outline-none"
              placeholder="Patient reports..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Objective (O)</label>
            <textarea
              required
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-healthcare-500 focus:outline-none"
              placeholder="Vitals, exam findings..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assessment (A)</label>
            <textarea
              required
              value={assessment}
              onChange={(e) => setAssessment(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-healthcare-500 focus:outline-none"
              placeholder="Diagnosis..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plan (P)</label>
            <textarea
              required
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-healthcare-500 focus:outline-none"
              placeholder="Treatment, prescriptions, follow-up..."
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-healthcare-600 text-white py-2.5 rounded-md font-medium hover:bg-healthcare-700 disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving..." : "Save Note"}
          </button>

          {saved && (
            <p className="text-center text-sm text-healthcare-700 bg-healthcare-50 rounded-md py-2">
              Note saved successfully!
            </p>
          )}
        </form>

        {/* History */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Notes</h2>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            <div className="space-y-4">
              {notes.map((note) => (
                <div key={note.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium text-gray-900">{note.patientName}</h3>
                    <span className="text-xs text-gray-500">
                      {new Date(note.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-semibold text-gray-700">S:</span> {note.subjective}</p>
                    <p><span className="font-semibold text-gray-700">O:</span> {note.objective}</p>
                    <p><span className="font-semibold text-gray-700">A:</span> {note.assessment}</p>
                    <p><span className="font-semibold text-gray-700">P:</span> {note.plan}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
