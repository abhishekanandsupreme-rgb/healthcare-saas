"use client";

import { useEffect, useState } from "react";

type Application = {
  id: string;
  candidateName: string;
  role: string;
  stage: "applied" | "screening" | "interview" | "offer" | "hired" | "rejected";
  appliedAt: string;
};

type Interview = {
  id: string;
  candidateName: string;
  role: string;
  date: string;
  type: string;
};

type QuickAction = {
  id: string;
  label: string;
  href: string;
  description: string;
};

export default function CareerOpsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  const quickActions: QuickAction[] = [
    { id: "qa1", label: "Post a Job", href: "/career-ops/jobs/new", description: "Create a new job posting" },
    { id: "qa2", label: "Review Applicants", href: "/career-ops/applications", description: "Review pending applications" },
    { id: "qa3", label: "Schedule Interview", href: "/career-ops/interviews/new", description: "Book a candidate interview" },
    { id: "qa4", label: "Send Offer", href: "/career-ops/offers/new", description: "Extend an offer letter" },
  ];

  useEffect(() => {
    Promise.all([
      fetch("/api/career/applications").then((r) => r.json()),
      fetch("/api/career/interviews").then((r) => r.json()),
    ])
      .then(([apps, ints]: [Application[], Interview[]]) => {
        setApplications(apps);
        setInterviews(ints);
        setLoading(false);
      })
      .catch(() => {
        setApplications([
          { id: "app1", candidateName: "Alice Park", role: "Frontend Engineer", stage: "interview", appliedAt: new Date().toISOString() },
          { id: "app2", candidateName: "Bob Smith", role: "Product Designer", stage: "screening", appliedAt: new Date().toISOString() },
          { id: "app3", candidateName: "Carol Wu", role: "Frontend Engineer", stage: "applied", appliedAt: new Date().toISOString() },
          { id: "app4", candidateName: "David Lee", role: "Engineering Manager", stage: "offer", appliedAt: new Date().toISOString() },
        ]);
        setInterviews([
          { id: "int1", candidateName: "Alice Park", role: "Frontend Engineer", date: new Date(Date.now() + 86400000).toISOString(), type: "Technical" },
          { id: "int2", candidateName: "Eve Davis", role: "Product Designer", date: new Date(Date.now() + 172800000).toISOString(), type: "Portfolio Review" },
        ]);
        setLoading(false);
      });
  }, []);

  const stageColor = (stage: Application["stage"]) => {
    switch (stage) {
      case "applied": return "bg-gray-100 text-gray-800";
      case "screening": return "bg-yellow-100 text-yellow-800";
      case "interview": return "bg-blue-100 text-blue-800";
      case "offer": return "bg-purple-100 text-purple-800";
      case "hired": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
    }
  };

  const stages: Application["stage"][] = ["applied", "screening", "interview", "offer", "hired", "rejected"];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Career Ops Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Applications", value: applications.length },
          { label: "Interviews", value: interviews.length },
          { label: "Offers", value: applications.filter((a) => a.stage === "offer").length },
          { label: "Hires", value: applications.filter((a) => a.stage === "hired").length },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <p className="text-sm text-gray-500">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <a
              key={action.id}
              href={action.href}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:border-healthcare-500 transition-colors group"
            >
              <h3 className="font-medium text-gray-900 group-hover:text-healthcare-700">{action.label}</h3>
              <p className="text-sm text-gray-500 mt-1">{action.description}</p>
            </a>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pipeline */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Application Pipeline</h2>
          {loading ? (
            <p className="text-gray-500">Loading pipeline...</p>
          ) : (
            <div className="space-y-6">
              {stages.map((stage) => {
                const items = applications.filter((a) => a.stage === stage);
                if (items.length === 0) return null;
                return (
                  <div key={stage}>
                    <h3 className="text-sm font-medium text-gray-500 mb-2 capitalize">{stage.replace("-", " ")}</h3>
                    <div className="space-y-2">
                      {items.map((app) => (
                        <div key={app.id} className="bg-white rounded-md border border-gray-200 p-3 flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900">{app.candidateName}</p>
                            <p className="text-sm text-gray-500">{app.role}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${stageColor(app.stage)} capitalize`}>
                            {app.stage}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Upcoming interviews */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Interviews</h2>
          {loading ? (
            <p className="text-gray-500">Loading interviews...</p>
          ) : interviews.length === 0 ? (
            <p className="text-gray-500">No upcoming interviews.</p>
          ) : (
            <div className="space-y-3">
              {interviews.map((interview) => (
                <div key={interview.id} className="bg-white rounded-md border border-gray-200 p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{interview.candidateName}</p>
                      <p className="text-sm text-gray-500">{interview.role}</p>
                      <p className="text-sm text-gray-500 mt-1">{interview.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(interview.date).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(interview.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
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
