"use client";

import { useEffect, useState, useCallback } from "react";
import type { Appointment } from "@/domain/appointment";
import type { Patient } from "@/domain/patient";
import type { Provider } from "@/domain/provider";

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  appointments: Appointment[];
}

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const statusColors: Record<string, string> = {
  scheduled: "bg-blue-100 text-blue-800 border-blue-200",
  confirmed: "bg-green-100 text-green-800 border-green-200",
  "checked-in": "bg-purple-100 text-purple-800 border-purple-200",
  "in-progress": "bg-yellow-100 text-yellow-800 border-yellow-200",
  completed: "bg-gray-100 text-gray-700 border-gray-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
  "no-show": "bg-orange-100 text-orange-800 border-orange-200",
};

function formatTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function getPatientName(patientId: string, patients: Patient[]): string {
  const patient = patients.find((p) => p.id === patientId);
  return patient ? `${patient.firstName} ${patient.lastName}` : patientId;
}

function getProviderName(providerId: string, providers: Provider[]): string {
  const provider = providers.find((p) => p.id === providerId);
  return provider
    ? `${provider.title || "Dr."} ${provider.firstName} ${provider.lastName}`
    : providerId;
}

export default function AppointmentCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [aptRes, patRes, provRes] = await Promise.all([
          fetch("/api/appointments"),
          fetch("/api/patients"),
          fetch("/api/providers"),
        ]);

        if (aptRes.ok) setAppointments(await aptRes.json());
        if (patRes.ok) setPatients(await patRes.json());
        if (provRes.ok) setProviders(await provRes.json());
      } catch (err) {
        console.error("Failed to fetch calendar data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const navigateMonth = useCallback((direction: number) => {
    setCurrentDate(new Date(year, month + direction, 1));
    setSelectedAppointment(null);
  }, [year, month]);

  const goToToday = useCallback(() => {
    setCurrentDate(new Date());
    setSelectedAppointment(null);
  }, []);

  // Build calendar grid
  const firstDayOfMonth = new Date(year, month, 1);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const today = new Date();
  const isToday = (d: number) =>
    d === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  const getAppointmentsForDate = useCallback(
    (day: number): Appointment[] => {
      return appointments.filter((apt) => {
        const aptDate = new Date(apt.scheduledStart);
        return (
          aptDate.getDate() === day &&
          aptDate.getMonth() === month &&
          aptDate.getFullYear() === year
        );
      });
    },
    [appointments, month, year]
  );

  const calendarDays: CalendarDay[] = [];

  // Previous month padding
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const date = new Date(year, month - 1, day);
    calendarDays.push({
      date,
      isCurrentMonth: false,
      isToday: false,
      appointments: [],
    });
  }

  // Current month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    calendarDays.push({
      date,
      isCurrentMonth: true,
      isToday: isToday(day),
      appointments: getAppointmentsForDate(day),
    });
  }

  // Next month padding
  const remainingDays = 42 - calendarDays.length; // 6 rows * 7 cols
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(year, month + 1, day);
    calendarDays.push({
      date,
      isCurrentMonth: false,
      isToday: false,
      appointments: [],
    });
  }

  // Stats for the month
  const monthAppointments = appointments.filter((apt) => {
    const d = new Date(apt.scheduledStart);
    return d.getMonth() === month && d.getFullYear() === year;
  });

  const stats = {
    total: monthAppointments.length,
    confirmed: monthAppointments.filter((a) => a.status === "confirmed").length,
    scheduled: monthAppointments.filter((a) => a.status === "scheduled").length,
    completed: monthAppointments.filter((a) => a.status === "completed").length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-healthcare-600"></div>
        <span className="ml-3 text-gray-600">Loading calendar...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {MONTH_NAMES[month]} {year}
          </h2>
          <div className="flex gap-1">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
              aria-label="Previous month"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={goToToday}
              className="px-3 py-1.5 text-sm font-medium rounded-md bg-healthcare-50 text-healthcare-700 hover:bg-healthcare-100"
            >
              Today
            </button>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 rounded-md hover:bg-gray-100 text-gray-600"
              aria-label="Next month"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="hidden sm:flex items-center gap-4 text-sm">
          <span className="text-gray-600">
            <span className="font-semibold text-gray-900">{stats.total}</span> total
          </span>
          <span className="text-blue-600">
            <span className="font-semibold">{stats.scheduled}</span> scheduled
          </span>
          <span className="text-green-600">
            <span className="font-semibold">{stats.confirmed}</span> confirmed
          </span>
          <span className="text-gray-500">
            <span className="font-semibold">{stats.completed}</span> completed
          </span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {DAY_NAMES.map((name) => (
          <div
            key={name}
            className="py-2 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50"
          >
            {name}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {calendarDays.map((day, idx) => (
          <div
            key={idx}
            className={`min-h-[100px] border-b border-r border-gray-100 p-1 ${
              !day.isCurrentMonth ? "bg-gray-50" : ""
            } ${day.isToday ? "bg-healthcare-50/30" : ""}`}
          >
            <div className="flex justify-between items-start mb-1">
              <span
                className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${
                  day.isToday
                    ? "bg-healthcare-600 text-white"
                    : day.isCurrentMonth
                    ? "text-gray-900"
                    : "text-gray-400"
                }`}
              >
                {day.date.getDate()}
              </span>
              {day.appointments.length > 0 && (
                <span className="text-xs text-gray-500">
                  {day.appointments.length}
                </span>
              )}
            </div>
            <div className="space-y-0.5 overflow-hidden max-h-[70px]">
              {day.appointments.slice(0, 3).map((apt) => (
                <button
                  key={apt.id}
                  onClick={() => setSelectedAppointment(apt)}
                  className={`w-full text-left text-xs px-1.5 py-0.5 rounded border truncate block ${
                    statusColors[apt.status] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {formatTime(apt.scheduledStart)}
                </button>
              ))}
              {day.appointments.length > 3 && (
                <span className="text-xs text-gray-500 pl-1">
                  +{day.appointments.length - 3} more
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Appointment Detail */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Appointment Details
              </h3>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <dl className="space-y-3">
              <div>
                <dt className="text-sm font-medium text-gray-500">Patient</dt>
                <dd className="text-sm text-gray-900">
                  {getPatientName(selectedAppointment.patientId, patients)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Provider</dt>
                <dd className="text-sm text-gray-900">
                  {getProviderName(selectedAppointment.providerId, providers)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Time</dt>
                <dd className="text-sm text-gray-900">
                  {formatTime(selectedAppointment.scheduledStart)} –{" "}
                  {formatTime(selectedAppointment.scheduledEnd)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Visit Type</dt>
                <dd className="text-sm text-gray-900 capitalize">
                  {selectedAppointment.visitType}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd>
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                      statusColors[selectedAppointment.status]
                    }`}
                  >
                    {selectedAppointment.status}
                  </span>
                </dd>
              </div>
              {selectedAppointment.reasonForVisit && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Reason</dt>
                  <dd className="text-sm text-gray-900">
                    {selectedAppointment.reasonForVisit}
                  </dd>
                </div>
              )}
            </dl>

            <button
              onClick={() => setSelectedAppointment(null)}
              className="mt-6 w-full rounded-md bg-healthcare-600 px-4 py-2 text-sm font-medium text-white hover:bg-healthcare-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}