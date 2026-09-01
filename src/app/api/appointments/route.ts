import { prisma } from '@/lib/prisma';
import { jsonResponse, errorResponse, getBody } from '@/lib/store';
import type { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const patientId = searchParams.get('patientId');
  const providerId = searchParams.get('providerId');

  if (id) {
    const appointment = await prisma.appointment.findUnique({ where: { id } });
    if (!appointment) return errorResponse('Appointment not found', 404);
    return jsonResponse(appointment);
  }

  const where: Prisma.AppointmentWhereInput = {};
  if (patientId) where.patientId = patientId;
  if (providerId) where.providerId = providerId;

  const appointments = await prisma.appointment.findMany({ where, orderBy: { startTime: 'desc' } });
  return jsonResponse(appointments);
}

export async function POST(request: Request) {
  try {
    const body = await getBody<{
      patientId: string;
      providerId: string;
      locationId?: string;
      status?: 'scheduled' | 'confirmed' | 'checked-in' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
      scheduledStart: string;
      scheduledEnd: string;
      visitType: 'routine' | 'follow-up' | 'urgent' | 'procedure' | 'other';
      reasonForVisit?: string;
      visitNotes?: string;
      billingCode?: string;
    }>(request);

    const now = new Date();
    const appointment = await prisma.appointment.create({
      data: {
        patientId: body.patientId,
        providerId: body.providerId,
        locationId: body.locationId,
        startTime: new Date(body.scheduledStart),
        endTime: new Date(body.scheduledEnd),
        status: body.status || 'scheduled',
        type: body.visitType,
        visitType: body.visitType,
        reasonForVisit: body.reasonForVisit,
        reason: body.reasonForVisit,
        visitNotes: body.visitNotes,
        notes: body.visitNotes,
        billingCode: body.billingCode,
        insuranceVerified: false,
        createdBy: 'api-user',
        createdAt: now,
        updatedAt: now,
      },
    });

    return jsonResponse(appointment, 201);
  } catch (err) {
    console.error('POST /api/appointments error:', err);
    return errorResponse('Invalid request body', 400);
  }
}