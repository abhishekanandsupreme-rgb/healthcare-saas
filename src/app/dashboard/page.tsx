"use client";

import { useState } from "react";

interface Appointment {
  id: string;
  patientName: string;
  providerName: string;
  date: string;
  time: string;
  status: "scheduled" | "confirmed" | "completed" | "cancelled";
}

const mockAppointments: Appointment[] = [
  {
    id: "1",
    patientName: "John Doe",
    providerName: "Dr. Sarah Smith",
    date: "2026-08-23",
    time: "09:00",
    status: "confirmed",
  },
  {
    id: "2",
    patientName: "Jane Roe",
    providerName: "Dr. Sarah Smith",
    date: "2026-08-23",
    time: "10:30",
    status: "scheduled",
  },
  {
    id: "3",
    patientName: "Bob Johnson",
    providerName: "Dr. Michael Lee",
    date: "2026-08-22",
    time: "14:00",
    status: "completed",
  },
];

const statusStyles: Record<Appointment["status"], string> = {
  scheduled: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  completed: "bg-gray-100 text-gray-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function Dashboard() {
  const [filter, setFilter] = useState<Appointment["status"] | "all">("all");

  const filteredAppointments =
    filter === "all"
      ? mockAppointments
      : mockAppointments.filter((a) => a.status === filter);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-3xl font-bold tracking-tight text-healthcare-900">
              Dashboard
            </h1>
            <p className="mt-2 text-sm text-healthcare-700">
              Manage appointments and view clinic activity.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">
            Filter by status:
          </label>
          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value as Appointment["status"] | "all")
            }
            className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-healthcare-500 focus:outline-none focus:ring-healthcare-500"
          >
            <option value="all">All</option>
            <option value="scheduled">Scheduled</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Appointments table */}
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-healthcare-900 sm:pl-0">
                      Patient
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-healthcare-900">
                      Provider
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-healthcare-900">
                      Date
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-healthcare-900">
                      Time
                    </th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-healthcare-900">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredAppointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-healthcare-900 sm:pl-0">
                        {appointment.patientName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {appointment.providerName}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {appointment.date}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {appointment.time}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span
                          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${statusStyles[appointment.status]}`}
                        >
                          {appointment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
