import type { Patient, Provider, Appointment } from '@/domain';

/* ------------------------------------------------------------------ */
/*  Seed data                                                         */
/* ------------------------------------------------------------------ */

const now = new Date();
const iso = (d: Date) => d.toISOString();

const seedPatients: Patient[] = [
  {
    id: 'pt-001',
    firstName: 'Alice',
    lastName: 'Johnson',
    dateOfBirth: '1985-03-12',
    biologicalSexAtBirth: 'female',
    email: 'alice.johnson@example.com',
    phone: '+1-555-0101',
    address: {
      line1: '123 Maple St',
      city: 'Springfield',
      state: 'IL',
      postalCode: '62704',
      country: 'US',
    },
    insuranceMemberId: 'INS-1001',
    insuranceProvider: 'BlueCross',
    insuranceGroupNumber: 'GRP-500',
    allergies: [{ substance: 'Penicillin', reaction: 'Hives', severity: 'moderate', onsetDate: '2010-05-20' }],
    primaryProviderId: 'prov-001',
    createdAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 30)),
    updatedAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2)),
    createdBy: 'system-seed',
  },
  {
    id: 'pt-002',
    firstName: 'Bob',
    lastName: 'Martinez',
    dateOfBirth: '1972-11-08',
    biologicalSexAtBirth: 'male',
    email: 'bob.martinez@example.com',
    phone: '+1-555-0102',
    address: {
      line1: '456 Oak Ave',
      line2: 'Apt 2B',
      city: 'Chicago',
      state: 'IL',
      postalCode: '60601',
      country: 'US',
    },
    insuranceMemberId: 'INS-1002',
    insuranceProvider: 'Aetna',
    insuranceGroupNumber: 'GRP-501',
    allergies: [],
    primaryProviderId: 'prov-002',
    createdAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 60)),
    updatedAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 5)),
    createdBy: 'system-seed',
  },
  {
    id: 'pt-003',
    firstName: 'Carol',
    lastName: 'Nguyen',
    dateOfBirth: '1999-07-22',
    biologicalSexAtBirth: 'female',
    email: 'carol.nguyen@example.com',
    phone: '+1-555-0103',
    address: {
      line1: '789 Pine Rd',
      city: 'Naperville',
      state: 'IL',
      postalCode: '60540',
      country: 'US',
    },
    insuranceMemberId: 'INS-1003',
    insuranceProvider: 'UnitedHealth',
    insuranceGroupNumber: 'GRP-502',
    allergies: [
      { substance: 'Sulfa drugs', reaction: 'Rash', severity: 'mild', onsetDate: '2022-01-15' },
      { substance: 'Peanuts', reaction: 'Anaphylaxis', severity: 'severe', onsetDate: '1999-07-22' },
    ],
    primaryProviderId: 'prov-001',
    createdAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 10)),
    updatedAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1)),
    createdBy: 'system-seed',
  },
];

const seedProviders: Provider[] = [
  {
    id: 'prov-001',
    firstName: 'Emily',
    lastName: 'Chen',
    npi: '1234567890',
    dea: 'BC1234567',
    licenseNumber: 'LIC-IL-001',
    licenseState: 'IL',
    specialty: 'Family Medicine',
    acceptingNewPatients: true,
    maxDailyAppointments: 20,
    email: 'emily.chen@clinic.example.com',
    phone: '+1-555-1001',
    title: 'MD',
    pronouns: 'she/her',
    defaultSlotDurationMinutes: 15,
    bufferMinutesBetweenAppointments: 5,
    createdAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 90)),
    updatedAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7)),
    createdBy: 'system-seed',
  },
  {
    id: 'prov-002',
    firstName: 'David',
    lastName: 'Okafor',
    npi: '0987654321',
    dea: 'BD7654321',
    licenseNumber: 'LIC-IL-002',
    licenseState: 'IL',
    specialty: 'Pediatrics',
    acceptingNewPatients: true,
    maxDailyAppointments: 16,
    email: 'david.okafor@clinic.example.com',
    phone: '+1-555-1002',
    title: 'DO',
    pronouns: 'he/him',
    defaultSlotDurationMinutes: 20,
    bufferMinutesBetweenAppointments: 10,
    createdAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 60)),
    updatedAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 4)),
    createdBy: 'system-seed',
  },
];

const seedAppointments: Appointment[] = [
  {
    id: 'apt-001',
    patientId: 'pt-001',
    providerId: 'prov-001',
    status: 'scheduled',
    scheduledStart: iso(new Date(now.getTime() + 1000 * 60 * 60 * 24 * 1)),
    scheduledEnd: iso(new Date(now.getTime() + 1000 * 60 * 60 * 24 * 1 + 15 * 60 * 1000)),
    visitType: 'routine',
    reasonForVisit: 'Annual physical exam',
    insuranceVerified: true,
    createdAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3)),
    updatedAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3)),
    createdBy: 'system-seed',
  },
  {
    id: 'apt-002',
    patientId: 'pt-002',
    providerId: 'prov-002',
    status: 'confirmed',
    scheduledStart: iso(new Date(now.getTime() + 1000 * 60 * 60 * 24 * 2)),
    scheduledEnd: iso(new Date(now.getTime() + 1000 * 60 * 60 * 24 * 2 + 20 * 60 * 1000)),
    visitType: 'follow-up',
    reasonForVisit: 'Follow-up on blood pressure',
    insuranceVerified: true,
    createdAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 5)),
    updatedAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1)),
    createdBy: 'system-seed',
  },
  {
    id: 'apt-003',
    patientId: 'pt-003',
    providerId: 'prov-001',
    status: 'completed',
    scheduledStart: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1)),
    scheduledEnd: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1 + 15 * 60 * 1000)),
    actualStart: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1)),
    actualEnd: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1 + 12 * 60 * 1000)),
    visitType: 'routine',
    reasonForVisit: 'Allergy consultation',
    visitNotes: 'Discussed peanut allergy management.',
    billingCode: '99213',
    insuranceVerified: true,
    createdAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7)),
    updatedAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1)),
    createdBy: 'system-seed',
  },
  {
    id: 'apt-004',
    patientId: 'pt-001',
    providerId: 'prov-002',
    status: 'cancelled',
    scheduledStart: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3)),
    scheduledEnd: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3 + 20 * 60 * 1000)),
    visitType: 'urgent',
    reasonForVisit: 'Cold symptoms',
    insuranceVerified: false,
    createdAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 8)),
    updatedAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3)),
    createdBy: 'system-seed',
  },
];

/* ------------------------------------------------------------------ */
/*  In-memory stores                                                   */
/* ------------------------------------------------------------------ */

type Store<T> = {
  getAll(): T[];
  getById(id: string): T | undefined;
  create(item: T): T;
  update(id: string, patch: Partial<T>): T | undefined;
  remove(id: string): boolean;
};

function createStore<T extends { id: string }>(initial: T[]): Store<T> {
  const items = new Map<string, T>();
  for (const item of initial) {
    items.set(item.id, item);
  }
  const store: Store<T> = {
    getAll() {
      return Array.from(items.values());
    },
    getById(id: string) {
      return items.get(id);
    },
    create(item: T) {
      items.set(item.id, item);
      return item;
    },
    update(id: string, patch: Partial<T>) {
      const existing = items.get(id);
      if (!existing) return undefined;
      const updated = { ...existing, ...patch } as T;
      items.set(id, updated);
      return updated;
    },
    remove(id: string) {
      return items.delete(id);
    },
  };
  return store;
}

export const patients = createStore<Patient>(seedPatients);
export const providers = createStore<Provider>(seedProviders);
export const appointments = createStore<Appointment>(seedAppointments);

/* Insurance eligibility records */
export interface InsuranceRecord {
  id: string;
  patientId: string;
  insuranceProvider: string;
  memberId: string;
  groupNumber: string;
  eligibilityStatus: 'active' | 'inactive' | 'expired' | 'pending';
  coverageStart: string;
  coverageEnd: string;
  copayAmount: number;
  deductibleRemaining: number;
  verifiedAt: string;
}

export const insuranceRecords: InsuranceRecord[] = [
  {
    id: 'ins-001',
    patientId: 'pt-001',
    insuranceProvider: 'BlueCross',
    memberId: 'INS-1001',
    groupNumber: 'GRP-500',
    eligibilityStatus: 'active',
    coverageStart: '2025-01-01',
    coverageEnd: '2025-12-31',
    copayAmount: 25,
    deductibleRemaining: 500,
    verifiedAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2)),
  },
  {
    id: 'ins-002',
    patientId: 'pt-002',
    insuranceProvider: 'Aetna',
    memberId: 'INS-1002',
    groupNumber: 'GRP-501',
    eligibilityStatus: 'active',
    coverageStart: '2025-03-01',
    coverageEnd: '2026-02-28',
    copayAmount: 30,
    deductibleRemaining: 1200,
    verifiedAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 5)),
  },
  {
    id: 'ins-003',
    patientId: 'pt-003',
    insuranceProvider: 'UnitedHealth',
    memberId: 'INS-1003',
    groupNumber: 'GRP-502',
    eligibilityStatus: 'active',
    coverageStart: '2025-01-01',
    coverageEnd: '2025-12-31',
    copayAmount: 20,
    deductibleRemaining: 350,
    verifiedAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1)),
  },
];

/* Billing records */
export interface BillingRecord {
  id: string;
  patientId: string;
  appointmentId?: string;
  amount: number;
  currency: string;
  status: 'draft' | 'pending' | 'paid' | 'overdue' | 'cancelled';
  insuranceAmount: number;
  patientAmount: number;
  billingCode?: string;
  description: string;
  dueDate: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export const billingRecords: BillingRecord[] = [
  {
    id: 'bill-001',
    patientId: 'pt-001',
    appointmentId: 'apt-003',
    amount: 150,
    currency: 'USD',
    status: 'paid',
    insuranceAmount: 120,
    patientAmount: 30,
    billingCode: '99213',
    description: 'Family medicine visit',
    dueDate: '2025-08-20',
    paidAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1)),
    createdAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 2)),
    updatedAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1)),
  },
  {
    id: 'bill-002',
    patientId: 'pt-003',
    appointmentId: 'apt-003',
    amount: 200,
    currency: 'USD',
    status: 'pending',
    insuranceAmount: 170,
    patientAmount: 30,
    billingCode: '99214',
    description: 'Allergy consultation',
    dueDate: '2025-08-25',
    createdAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1)),
    updatedAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1)),
  },
  {
    id: 'bill-003',
    patientId: 'pt-002',
    appointmentId: undefined,
    amount: 75,
    currency: 'USD',
    status: 'overdue',
    insuranceAmount: 0,
    patientAmount: 75,
    description: 'Lab work - metabolic panel',
    dueDate: '2025-08-01',
    createdAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 10)),
    updatedAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 10)),
  },
];

/* Check-in records */
export interface CheckInRecord {
  id: string;
  appointmentId: string;
  patientId: string;
  checkedInAt: string;
  status: 'checked-in' | 'in-room' | 'completed' | 'no-show';
  notes?: string;
}

export const checkInRecords: CheckInRecord[] = [
  {
    id: 'ci-001',
    appointmentId: 'apt-003',
    patientId: 'pt-003',
    checkedInAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1 - 10 * 60 * 1000)),
    status: 'completed',
    notes: 'Arrived 10 min early, vitals taken.',
  },
];

/* Career-ops stats */
export interface CareerOpStats {
  totalOpenPositions: number;
  totalApplications: number;
  applicationsByDepartment: Record<string, number>;
  avgDaysToHire: number;
  offerAcceptanceRate: number;
  topSources: { source: string; count: number }[];
  recentApplications: {
    id: string;
    applicantName: string;
    position: string;
    department: string;
    appliedAt: string;
    status: 'submitted' | 'reviewing' | 'interviewing' | 'offered' | 'hired' | 'rejected';
  }[];
}

export const careerOpsStats: CareerOpStats = {
  totalOpenPositions: 8,
  totalApplications: 124,
  applicationsByDepartment: {
    Engineering: 45,
    Nursing: 32,
    'Medical Records': 18,
    'Billing & Insurance': 22,
    Administration: 7,
  },
  avgDaysToHire: 14.2,
  offerAcceptanceRate: 0.88,
  topSources: [
    { source: 'LinkedIn', count: 52 },
    { source: 'Indeed', count: 38 },
    { source: 'Hospital Careers Page', count: 21 },
    { source: 'Employee Referral', count: 13 },
  ],
  recentApplications: [
    {
      id: 'app-001',
      applicantName: 'Jordan Smith',
      position: 'Registered Nurse',
      department: 'Nursing',
      appliedAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 2)),
      status: 'submitted',
    },
    {
      id: 'app-002',
      applicantName: 'Priya Patel',
      position: 'Senior Backend Engineer',
      department: 'Engineering',
      appliedAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 5)),
      status: 'interviewing',
    },
    {
      id: 'app-003',
      applicantName: 'Michael Brown',
      position: 'Medical Coder',
      department: 'Medical Records',
      appliedAt: iso(new Date(now.getTime() - 1000 * 60 * 60 * 24)),
      status: 'offered',
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Helpers for route.ts files                                         */
/* ------------------------------------------------------------------ */

export function jsonResponse<T>(data: T, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function errorResponse(message: string, status = 400): Response {
  return jsonResponse({ error: message }, status);
}

export function getBody<T>(req: Request): Promise<T> {
  return req.json() as Promise<T>;
}
