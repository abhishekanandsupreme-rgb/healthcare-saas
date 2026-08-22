import { billingRecords } from '@/lib/store';
import { jsonResponse, errorResponse, getBody } from '@/lib/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const patientId = searchParams.get('patientId');
  const status = searchParams.get('status');

  if (id) {
    const record = billingRecords.find((r) => r.id === id);
    if (!record) return errorResponse('Billing record not found', 404);
    return jsonResponse(record);
  }

  let results = billingRecords;
  if (patientId) {
    results = results.filter((r) => r.patientId === patientId);
  }
  if (status) {
    results = results.filter((r) => r.status === status);
  }
  return jsonResponse(results);
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

    const id = `bill-${Date.now()}`;
    const now = new Date().toISOString();

    const record = {
      id,
      patientId: body.patientId,
      appointmentId: body.appointmentId,
      amount: body.amount,
      currency: body.currency || 'USD',
      status: 'pending' as const,
      insuranceAmount: body.insuranceAmount ?? 0,
      patientAmount: body.patientAmount ?? body.amount,
      billingCode: body.billingCode,
      description: body.description,
      dueDate: body.dueDate,
      createdAt: now,
      updatedAt: now,
    };

    billingRecords.push(record);
    return jsonResponse(record, 201);
  } catch {
    return errorResponse('Invalid request body', 400);
  }
}
