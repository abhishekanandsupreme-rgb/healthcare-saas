"use client";

import { useState } from "react";
import type { Patient } from "@/domain/patient";

interface PatientFormProps {
  onSuccess?: (patient: Patient) => void;
  onCancel?: () => void;
}

const initialFormState = {
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  biologicalSexAtBirth: "unknown" as Patient["biologicalSexAtBirth"],
  email: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  addressCity: "",
  addressState: "",
  addressPostalCode: "",
  addressCountry: "US",
  insuranceMemberId: "",
  insuranceProvider: "",
  insuranceGroupNumber: "",
  primaryProviderId: "",
};

export default function PatientForm({ onSuccess, onCancel }: PatientFormProps) {
  const [form, setForm] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        dateOfBirth: form.dateOfBirth,
        biologicalSexAtBirth: form.biologicalSexAtBirth,
        email: form.email || undefined,
        phone: form.phone || undefined,
        address:
          form.addressLine1 || form.addressCity || form.addressState
            ? {
                line1: form.addressLine1,
                line2: form.addressLine2 || undefined,
                city: form.addressCity,
                state: form.addressState,
                postalCode: form.addressPostalCode,
                country: form.addressCountry,
              }
            : undefined,
        insuranceMemberId: form.insuranceMemberId || undefined,
        insuranceProvider: form.insuranceProvider || undefined,
        insuranceGroupNumber: form.insuranceGroupNumber || undefined,
        primaryProviderId: form.primaryProviderId || undefined,
      };

      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create patient");
      }

      const patient: Patient = await res.json();
      setSuccess(true);
      setForm(initialFormState);
      onSuccess?.(patient);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            required
            value={form.firstName}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-healthcare-500 focus:outline-none focus:ring-1 focus:ring-healthcare-500"
          />
        </div>
        <div>
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            required
            value={form.lastName}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-healthcare-500 focus:outline-none focus:ring-1 focus:ring-healthcare-500"
          />
        </div>
      </div>

      {/* DOB and Sex */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="dateOfBirth"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            required
            value={form.dateOfBirth}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-healthcare-500 focus:outline-none focus:ring-1 focus:ring-healthcare-500"
          />
        </div>
        <div>
          <label
            htmlFor="biologicalSexAtBirth"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Biological Sex at Birth <span className="text-red-500">*</span>
          </label>
          <select
            id="biologicalSexAtBirth"
            name="biologicalSexAtBirth"
            required
            value={form.biologicalSexAtBirth}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-healthcare-500 focus:outline-none focus:ring-1 focus:ring-healthcare-500"
          >
            <option value="unknown">Unknown</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Contact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-healthcare-500 focus:outline-none focus:ring-1 focus:ring-healthcare-500"
          />
        </div>
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            value={form.phone}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-healthcare-500 focus:outline-none focus:ring-1 focus:ring-healthcare-500"
          />
        </div>
      </div>

      {/* Address */}
      <fieldset className="border border-gray-200 rounded-md p-4">
        <legend className="text-sm font-medium text-gray-700 px-2">
          Address
        </legend>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="addressLine1"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Street Address
            </label>
            <input
              id="addressLine1"
              name="addressLine1"
              type="text"
              value={form.addressLine1}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-healthcare-500 focus:outline-none focus:ring-1 focus:ring-healthcare-500"
            />
          </div>
          <div>
            <label
              htmlFor="addressLine2"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Address Line 2
            </label>
            <input
              id="addressLine2"
              name="addressLine2"
              type="text"
              value={form.addressLine2}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-healthcare-500 focus:outline-none focus:ring-1 focus:ring-healthcare-500"
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="col-span-2">
              <label
                htmlFor="addressCity"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                City
              </label>
              <input
                id="addressCity"
                name="addressCity"
                type="text"
                value={form.addressCity}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-healthcare-500 focus:outline-none focus:ring-1 focus:ring-healthcare-500"
              />
            </div>
            <div>
              <label
                htmlFor="addressState"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                State
              </label>
              <input
                id="addressState"
                name="addressState"
                type="text"
                value={form.addressState}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-healthcare-500 focus:outline-none focus:ring-1 focus:ring-healthcare-500"
              />
            </div>
            <div>
              <label
                htmlFor="addressPostalCode"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                ZIP
              </label>
              <input
                id="addressPostalCode"
                name="addressPostalCode"
                type="text"
                value={form.addressPostalCode}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-healthcare-500 focus:outline-none focus:ring-1 focus:ring-healthcare-500"
              />
            </div>
          </div>
        </div>
      </fieldset>

      {/* Insurance */}
      <fieldset className="border border-gray-200 rounded-md p-4">
        <legend className="text-sm font-medium text-gray-700 px-2">
          Insurance
        </legend>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="insuranceProvider"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Insurance Provider
            </label>
            <input
              id="insuranceProvider"
              name="insuranceProvider"
              type="text"
              value={form.insuranceProvider}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-healthcare-500 focus:outline-none focus:ring-1 focus:ring-healthcare-500"
            />
          </div>
          <div>
            <label
              htmlFor="insuranceMemberId"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Member ID
            </label>
            <input
              id="insuranceMemberId"
              name="insuranceMemberId"
              type="text"
              value={form.insuranceMemberId}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-healthcare-500 focus:outline-none focus:ring-1 focus:ring-healthcare-500"
            />
          </div>
          <div>
            <label
              htmlFor="insuranceGroupNumber"
              className="block text-sm font-medium text-gray-600 mb-1"
            >
              Group Number
            </label>
            <input
              id="insuranceGroupNumber"
              name="insuranceGroupNumber"
              type="text"
              value={form.insuranceGroupNumber}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-healthcare-500 focus:outline-none focus:ring-1 focus:ring-healthcare-500"
            />
          </div>
        </div>
      </fieldset>

      {/* Primary Provider */}
      <div>
        <label
          htmlFor="primaryProviderId"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Primary Provider ID
        </label>
        <input
          id="primaryProviderId"
          name="primaryProviderId"
          type="text"
          value={form.primaryProviderId}
          onChange={handleChange}
          placeholder="e.g. prov-001"
          className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-healthcare-500 focus:outline-none focus:ring-1 focus:ring-healthcare-500"
        />
      </div>

      {/* Messages */}
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">
          Patient created successfully!
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 justify-end">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-healthcare-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-healthcare-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? "Creating..." : "Create Patient"}
        </button>
      </div>
    </form>
  );
}