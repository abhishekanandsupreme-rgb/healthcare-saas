import { prisma } from '@/lib/prisma';
import { jsonResponse, errorResponse, getBody } from '@/lib/store';
import type { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const patientId = searchParams.get('patientId');
  const status = searchParams.get('status');

  if (id) {
    const record = await prisma.billingRecord.findUnique({ where: { id } });
    if (!record) return errorResponse('Billing record not found', 404);
    return jsonResponse(record);
  }

  const where: Prisma.BillingRecordWhereInput = {};
  if (patientId) where.patientId = patientId;
  if (status) where.status = status;

  const records = await prisma.billingRecord.findMany({ where, orderBy: { createdAt: 'desc' } });
  return jsonResponse(records);
}

export async function POST(request: Request) {
  try {
    const body = await getBody<{
      patientId: string;
      appointmentId?: string;
      amount: number;
      currency?: string;
      insuranceAmount?: number;
      patientAmount?: number;
      billingCode?: string;
      description: string;
      dueDate: string;
    }>(request);

    const now = new Date();
    const record = await prisma.billingRecord.create({
      data: {
        patientId: body.patientId,
        appointmentId: body.appointmentId,
        amount: body.amount,
        currency: body.currency || 'USD',
        status: 'pending',
        insuranceAmount: body.insuranceAmount ?? 0,
        patientAmount: body.patientAmount ?? body.amount,
        billingCode: body.billingCode,
        description: body.description,
        dueDate: new Date(body.dueDate),
        createdAt: now,
        updatedAt: now,
      },
    });

    return jsonResponse(record, 201);
  } catch (err) {
    console.error('POST /api/billing error:', err);
    return errorResponse('Invalid request body', 400);
  }
}