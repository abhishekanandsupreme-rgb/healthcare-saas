import { patients } from '@/lib/store';
import { jsonResponse, errorResponse } from '@/lib/store';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const patient = patients.getById(params.id);
  if (!patient) return errorResponse('Patient not found', 404);
  return jsonResponse(patient);
}

export async function PUT(_request: Request, { params }: { params: { id: string } }) {
  const patient = patients.getById(params.id);
  if (!patient) return errorResponse('Patient not found', 404);

  const body = await _request.json();
  const updated = patients.update(params.id, {
    ...body,
    updatedAt: new Date().toISOString(),
  });

  if (!updated) return errorResponse('Failed to update patient', 500);
  return jsonResponse(updated);
}

export async function PATCH(_request: Request, { params }: { params: { id: string } }) {
  return PUT(_request, { params });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const exists = patients.getById(params.id);
  if (!exists) return errorResponse('Patient not found', 404);

  const removed = patients.remove(params.id);
  if (!removed) return errorResponse('Failed to delete patient', 500);
  return jsonResponse({ success: true, message: 'Patient deleted' });
}
