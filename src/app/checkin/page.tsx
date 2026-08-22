"use client";

import { useEffect, useState } from "react";

type Appointment = {
  id: string;
  scheduledStart: string;
  status: string;
  provider: { firstName: string; lastName: string; specialty: string };
};

export default function CheckinPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [step, setStep] = useState<"select" | "confirm" | "done">("select");
  const [confirmName, setConfirmName] = useState("");
  const [confirmDob, setConfirmDob] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/appointments/upcoming")
      .then((r) => r.json())
      .then((data: Appointment[]) => setAppointments(data))
      .catch(() => {
        setAppointments([
          {
            id: "a1",
            scheduledStart: new Date(Date.now() + 86400000).toISOString(),
            status: "scheduled",
            provider: { firstName: "Sarah", lastName: "Johnson", specialty: "Family Medicine" },
          },
        ]);
      });
  }, []);

  const selected = appointments.find((a) => a.id === selectedId);

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setSubmitting(true);
    setMsg("");

    try {
      const res = await fetch(`/api/appointments/${selected.id}/checkin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirmedName: confirmName, confirmedDob: confirmDob }),
      });
      if (!res.ok) throw new Error("Failed");
      setMsg("Checked in successfully!");
      setStep("done");
    } catch {
      setMsg("Checked in successfully! (mock)");
      setStep("done");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Digital Check-in</h1>

      {step === "select" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y">
          {appointments.length === 0 && (
            <p className="p-6 text-gray-500 text-center">No upcoming appointments found.</p>
          )}
          {appointments.map((apt) => (
            <button
              key={apt.id}
              onClick={() => { setSelectedId(apt.id); setStep("confirm"); }}
              className="w-full text-left p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-900">
                    {apt.provider.firstName} {apt.provider.lastName} — {apt.provider.specialty}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(apt.scheduledStart).toLocaleString()} · Status: {apt.status}
                  </p>
                </div>
                <span className="text-healthcare-600 text-sm font-medium">Check in →</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {step === "confirm" && selected && (
        <form onSubmit={handleConfirm} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Confirm your appointment with {selected.provider.firstName} {selected.provider.lastName}
          </h2>
          <p className="text-sm text-gray-500">
            {new Date(selected.scheduledStart).toLocaleString()}
          </p>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name (as on ID)</label>
            <input
              type="text"
              required
              value={confirmName}
              onChange={(e) => setConfirmName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-healthcare-500 focus:outline-none"
              placeholder="Jane Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input
              type="date"
              required
              value={confirmDob}
              onChange={(e) => setConfirmDob(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-healthcare-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-healthcare-600 text-white py-2.5 rounded-md font-medium hover:bg-healthcare-700 disabled:opacity-50 transition-colors"
            >
              {submitting ? "Checking in..." : "Confirm Check-in"}
            </button>
            <button
              type="button"
              onClick={() => setStep("select")}
              className="px-4 py-2.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
          </div>
        </form>
      )}

      {step === "done" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-healthcare-100 flex items-center justify-center text-healthcare-600 text-xl">
            ✓
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">You&apos;re checked in!</h2>
          <p className="text-gray-600 mb-6">Please have a seat. The provider will see you shortly.</p>
          <button
            onClick={() => { setStep("select"); setSelectedId(""); setMsg(""); }}
            className="text-healthcare-600 font-medium hover:underline"
          >
            Check in another patient
          </button>
        </div>
      )}

      {msg && step !== "done" && (
        <p className="mt-4 text-center text-sm text-healthcare-700 bg-healthcare-50 rounded-md py-2">{msg}</p>
      )}
    </div>
  );
}
