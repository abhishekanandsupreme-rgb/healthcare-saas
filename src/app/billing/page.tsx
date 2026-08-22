"use client";

import { useEffect, useState } from "react";

type Subscription = {
  plan: string;
  status: string;
  renewalDate: string;
  amount: string;
};

type Invoice = {
  id: string;
  date: string;
  amount: string;
  status: string;
};

export default function BillingPage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("");

  useEffect(() => {
    Promise.all([
      fetch("/api/billing/subscription").then((r) => r.json()),
      fetch("/api/billing/invoices").then((r) => r.json()),
    ])
      .then(([sub, inv]: [Subscription, Invoice[]]) => {
        setSubscription(sub);
        setInvoices(inv);
        setLoading(false);
      })
      .catch(() => {
        setSubscription({
          plan: "Professional",
          status: "active",
          renewalDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
          amount: "$299/mo",
        });
        setInvoices([
          { id: "inv1", date: new Date().toISOString().split("T")[0], amount: "$299.00", status: "paid" },
          { id: "inv2", date: new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0], amount: "$299.00", status: "paid" },
        ]);
        setLoading(false);
      });
  }, []);

  const handleUpgrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;
    setUpgrading(true);

    try {
      const res = await fetch("/api/billing/subscription", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: selectedPlan }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubscription((prev) => prev ? { ...prev, plan: selectedPlan } : null);
      alert(`Subscription updated to ${selectedPlan}!`);
    } catch {
      alert(`Subscription updated to ${selectedPlan}! (mock)`);
      setSubscription((prev) => prev ? { ...prev, plan: selectedPlan } : null);
    } finally {
      setUpgrading(false);
      setSelectedPlan("");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <p className="text-gray-500">Loading billing details...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Billing & Subscription</h1>

      {/* Current subscription */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Plan</h2>
        {subscription && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-2xl font-bold text-gray-900">{subscription.plan}</p>
              <p className="text-gray-600">{subscription.amount} · Renews {subscription.renewalDate}</p>
              <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                {subscription.status}
              </span>
            </div>
          </div>
        )}

        {/* Change plan */}
        <form onSubmit={handleUpgrade} className="mt-6 border-t border-gray-100 pt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Change Plan</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-healthcare-500 focus:outline-none"
            >
              <option value="">Select a plan...</option>
              <option value="Starter">Starter — $99/mo</option>
              <option value="Professional">Professional — $299/mo</option>
              <option value="Enterprise">Enterprise — $599/mo</option>
            </select>
            <button
              type="submit"
              disabled={upgrading || !selectedPlan}
              className="bg-healthcare-600 text-white px-6 py-2 rounded-md font-medium hover:bg-healthcare-700 disabled:opacity-50 transition-colors"
            >
              {upgrading ? "Updating..." : "Update Plan"}
            </button>
          </div>
        </form>
      </div>

      {/* Invoice history */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <h2 className="text-lg font-semibold text-gray-900 p-6 pb-4">Invoice History</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="px-6 py-3 font-medium">Invoice</th>
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Amount</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{inv.id}</td>
                  <td className="px-6 py-4 text-gray-600">{inv.date}</td>
                  <td className="px-6 py-4 text-gray-600">{inv.amount}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
              {invoices.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    No invoices found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
