import { billingRecords } from '@/lib/store';
import { jsonResponse, errorResponse } from '@/lib/store';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const record = billingRecords.find((r) => r.id === params.id);
  if (!record) return errorResponse('Billing record not found', 404);
  return jsonResponse(record);
}

export async function PUT(_request: Request, { params }: { params: { id: string } }) {
  const index = billingRecords.findIndex((r) => r.id === params.id);
  if (index < 0) return errorResponse('Billing record not found', 404);

  const body = await _request.json();
  const now = new Date().toISOString();

  const updated = {
    ...billingRecords[index],
    ...body,
    updatedAt: now,
  };

  billingRecords[index] = updated;
  return jsonResponse(updated);
}

export async function PATCH(_request: Request, { params }: { params: { id: string } }) {
  return PUT(_request, { params });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const index = billingRecords.findIndex((r) => r.id === params.id);
  if (index < 0) return errorResponse('Billing record not found', 404);

  const removed = billingRecords.splice(index, 1)[0];
  return jsonResponse({ success: true, message: 'Billing record deleted', data: removed });
}
