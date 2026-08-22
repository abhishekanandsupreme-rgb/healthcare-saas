import { appointments } from '@/lib/store';
import { jsonResponse, errorResponse } from '@/lib/store';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const appointment = appointments.getById(params.id);
  if (!appointment) return errorResponse('Appointment not found', 404);
  return jsonResponse(appointment);
}

export async function PUT(_request: Request, { params }: { params: { id: string } }) {
  const appointment = appointments.getById(params.id);
  if (!appointment) return errorResponse('Appointment not found', 404);

  const body = await _request.json();
  const updated = appointments.update(params.id, {
    ...body,
    updatedAt: new Date().toISOString(),
  });

  if (!updated) return errorResponse('Failed to update appointment', 500);
  return jsonResponse(updated);
}

export async function PATCH(_request: Request, { params }: { params: { id: string } }) {
  return PUT(_request, { params });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const exists = appointments.getById(params.id);
  if (!exists) return errorResponse('Appointment not found', 404);

  const removed = appointments.remove(params.id);
  if (!removed) return errorResponse('Failed to delete appointment', 500);
  return jsonResponse({ success: true, message: 'Appointment deleted' });
}
