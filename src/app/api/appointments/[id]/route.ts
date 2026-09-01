import { prisma } from '@/lib/prisma';
import { jsonResponse, errorResponse } from '@/lib/store';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const appointment = await prisma.appointment.findUnique({ where: { id: params.id } });
  if (!appointment) return errorResponse('Appointment not found', 404);
  return jsonResponse(appointment);
}

export async function PUT(_request: Request, { params }: { params: { id: string } }) {
  const existing = await prisma.appointment.findUnique({ where: { id: params.id } });
  if (!existing) return errorResponse('Appointment not found', 404);

  const body = await _request.json();
  const updated = await prisma.appointment.update({
    where: { id: params.id },
    data: {
      ...body,
      updatedAt: new Date(),
    },
  });

  return jsonResponse(updated);
}

export async function PATCH(_request: Request, { params }: { params: { id: string } }) {
  return PUT(_request, { params });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const exists = await prisma.appointment.findUnique({ where: { id: params.id } });
  if (!exists) return errorResponse('Appointment not found', 404);

  await prisma.appointment.delete({ where: { id: params.id } });
  return jsonResponse({ success: true, message: 'Appointment deleted' });
}