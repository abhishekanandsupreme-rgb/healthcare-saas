import { prisma } from '@/lib/prisma';
import { jsonResponse, errorResponse, getBody } from '@/lib/store';
import type { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const appointmentId = searchParams.get('appointmentId');
  const patientId = searchParams.get('patientId');

  const where: Prisma.CheckInWhereInput = {};
  if (appointmentId) where.appointmentId = appointmentId;
  if (patientId) where.patientId = patientId;

  const results = await prisma.checkIn.findMany({ where, orderBy: { checkedInAt: 'desc' } });
  return jsonResponse(results);
}

export async function POST(request: Request) {
  try {
    const body = await getBody<{ appointmentId: string; notes?: string }>(request);

    const appointment = await prisma.appointment.findUnique({ where: { id: body.appointmentId } });
    if (!appointment) return errorResponse('Appointment not found', 404);

    const patient = await prisma.patient.findUnique({ where: { id: appointment.patientId } });
    if (!patient) return errorResponse('Patient not found', 404);

    const now = new Date();

    const checkIn = await prisma.checkIn.create({
      data: {
        appointmentId: body.appointmentId,
        patientId: appointment.patientId,
        checkedInAt: now,
        status: 'checked-in',
        notes: body.notes,
      },
    });

    // Update appointment status
    await prisma.appointment.update({
      where: { id: body.appointmentId },
      data: {
        status: 'checked-in',
        actualStart: now,
        updatedAt: now,
      },
    });

    return jsonResponse(checkIn, 201);
  } catch (err) {
    console.error('POST /api/checkin error:', err);
    return errorResponse('Invalid request body', 400);
  }
}