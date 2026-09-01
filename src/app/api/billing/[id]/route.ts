import { prisma } from '@/lib/prisma';
import { jsonResponse, errorResponse } from '@/lib/store';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const record = await prisma.billingRecord.findUnique({ where: { id: params.id } });
  if (!record) return errorResponse('Billing record not found', 404);
  return jsonResponse(record);
}

export async function PUT(_request: Request, { params }: { params: { id: string } }) {
  const existing = await prisma.billingRecord.findUnique({ where: { id: params.id } });
  if (!existing) return errorResponse('Billing record not found', 404);

  const body = await _request.json();
  const updated = await prisma.billingRecord.update({
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
  const exists = await prisma.billingRecord.findUnique({ where: { id: params.id } });
  if (!exists) return errorResponse('Billing record not found', 404);

  const removed = await prisma.billingRecord.delete({ where: { id: params.id } });
  return jsonResponse({ success: true, message: 'Billing record deleted', data: removed });
}