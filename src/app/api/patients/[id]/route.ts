import { prisma } from '@/lib/prisma';
import { jsonResponse, errorResponse } from '@/lib/store';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const patient = await prisma.patient.findUnique({ where: { id: params.id } });
  if (!patient) return errorResponse('Patient not found', 404);
  return jsonResponse(patient);
}

export async function PUT(_request: Request, { params }: { params: { id: string } }) {
  const existing = await prisma.patient.findUnique({ where: { id: params.id } });
  if (!existing) return errorResponse('Patient not found', 404);

  const body = await _request.json();
  const updated = await prisma.patient.update({
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
  const exists = await prisma.patient.findUnique({ where: { id: params.id } });
  if (!exists) return errorResponse('Patient not found', 404);

  await prisma.patient.delete({ where: { id: params.id } });
  return jsonResponse({ success: true, message: 'Patient deleted' });
}