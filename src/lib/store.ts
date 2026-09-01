import prisma from './prisma';

/* ------------------------------------------------------------------ */
/*  Re-exports                                                         */
/* ------------------------------------------------------------------ */

export { default as prisma } from './prisma';
export type { PrismaClient } from '@prisma/client';

/* ------------------------------------------------------------------ */
/*  Helper functions for route.ts files                                */
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

/* ------------------------------------------------------------------ */
/*  Data access layer (Prisma-backed)                                  */
/* ------------------------------------------------------------------ */

export const patients = {
  async getAll() {
    return prisma.patient.findMany({ orderBy: { createdAt: 'desc' } });
  },
  async getById(id: string) {
    return prisma.patient.findUnique({ where: { id } });
  },
  async create(data: Parameters<typeof prisma.patient.create>[0]['data']) {
    return prisma.patient.create({ data });
  },
  async update(id: string, data: Parameters<typeof prisma.patient.update>[0]['data']) {
    return prisma.patient.update({ where: { id }, data });
  },
  async remove(id: string) {
    await prisma.patient.delete({ where: { id } }).catch(() => null);
    return true;
  },
};

export const providers = {
  async getAll() {
    return prisma.provider.findMany({ orderBy: { createdAt: 'desc' } });
  },
  async getById(id: string) {
    return prisma.provider.findUnique({ where: { id } });
  },
  async create(data: Parameters<typeof prisma.provider.create>[0]['data']) {
    return prisma.provider.create({ data });
  },
  async update(id: string, data: Parameters<typeof prisma.provider.update>[0]['data']) {
    return prisma.provider.update({ where: { id }, data });
  },
  async remove(id: string) {
    await prisma.provider.delete({ where: { id } }).catch(() => null);
    return true;
  },
};

export const appointments = {
  async getAll() {
    return prisma.appointment.findMany({ orderBy: { startTime: 'desc' } });
  },
  async getById(id: string) {
    return prisma.appointment.findUnique({ where: { id } });
  },
  async create(data: Parameters<typeof prisma.appointment.create>[0]['data']) {
    return prisma.appointment.create({ data });
  },
  async update(id: string, data: Parameters<typeof prisma.appointment.update>[0]['data']) {
    return prisma.appointment.update({ where: { id }, data });
  },
  async remove(id: string) {
    await prisma.appointment.delete({ where: { id } }).catch(() => null);
    return true;
  },
};

/* ------------------------------------------------------------------ */
/*  Billing records                                                    */
/* ------------------------------------------------------------------ */

export const billingRecords = {
  async getAll() {
    return prisma.billingRecord.findMany({ orderBy: { createdAt: 'desc' } });
  },
  async getById(id: string) {
    return prisma.billingRecord.findUnique({ where: { id } });
  },
  async getByPatientId(patientId: string) {
    return prisma.billingRecord.findMany({ where: { patientId } });
  },
  async create(data: Parameters<typeof prisma.billingRecord.create>[0]['data']) {
    return prisma.billingRecord.create({ data });
  },
  async update(id: string, data: Parameters<typeof prisma.billingRecord.update>[0]['data']) {
    return prisma.billingRecord.update({ where: { id }, data });
  },
  async remove(id: string) {
    await prisma.billingRecord.delete({ where: { id } }).catch(() => null);
    return true;
  },
};

/* ------------------------------------------------------------------ */
/*  Insurance records                                                  */
/* ------------------------------------------------------------------ */

export const insuranceRecords = {
  async getAll() {
    return prisma.insuranceRecord.findMany({ orderBy: { verifiedAt: 'desc' } });
  },
  async getById(id: string) {
    return prisma.insuranceRecord.findUnique({ where: { id } });
  },
  async getByPatientId(patientId: string) {
    return prisma.insuranceRecord.findFirst({ where: { patientId } });
  },
  async create(data: Parameters<typeof prisma.insuranceRecord.create>[0]['data']) {
    return prisma.insuranceRecord.create({ data });
  },
  async update(id: string, data: Parameters<typeof prisma.insuranceRecord.update>[0]['data']) {
    return prisma.insuranceRecord.update({ where: { id }, data });
  },
  async remove(id: string) {
    await prisma.insuranceRecord.delete({ where: { id } }).catch(() => null);
    return true;
  },
};

/* ------------------------------------------------------------------ */
/*  Check-in records                                                   */
/* ------------------------------------------------------------------ */

export const checkInRecords = {
  async getAll() {
    return prisma.checkIn.findMany({ orderBy: { checkedInAt: 'desc' } });
  },
  async getByAppointmentId(appointmentId: string) {
    return prisma.checkIn.findMany({ where: { appointmentId } });
  },
  async getByPatientId(patientId: string) {
    return prisma.checkIn.findMany({ where: { patientId } });
  },
  async create(data: Parameters<typeof prisma.checkIn.create>[0]['data']) {
    return prisma.checkIn.create({ data });
  },
};

/* ------------------------------------------------------------------ */
/*  Career-ops stats (static, not DB-backed)                           */
/* ------------------------------------------------------------------ */

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
      appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      status: 'submitted',
    },
    {
      id: 'app-002',
      applicantName: 'Priya Patel',
      position: 'Senior Backend Engineer',
      department: 'Engineering',
      appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      status: 'interviewing',
    },
    {
      id: 'app-003',
      applicantName: 'Michael Brown',
      position: 'Medical Coder',
      department: 'Medical Records',
      appliedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      status: 'offered',
    },
  ],
};