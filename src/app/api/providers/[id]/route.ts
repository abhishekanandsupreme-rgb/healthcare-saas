import { providers } from '@/lib/store';
import { jsonResponse, errorResponse } from '@/lib/store';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const provider = providers.getById(params.id);
  if (!provider) return errorResponse('Provider not found', 404);
  return jsonResponse(provider);
}

export async function PUT(_request: Request, { params }: { params: { id: string } }) {
  const provider = providers.getById(params.id);
  if (!provider) return errorResponse('Provider not found', 404);

  const body = await _request.json();
  const updated = providers.update(params.id, {
    ...body,
    updatedAt: new Date().toISOString(),
  });

  if (!updated) return errorResponse('Failed to update provider', 500);
  return jsonResponse(updated);
}

export async function PATCH(_request: Request, { params }: { params: { id: string } }) {
  return PUT(_request, { params });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const exists = providers.getById(params.id);
  if (!exists) return errorResponse('Provider not found', 404);

  const removed = providers.remove(params.id);
  if (!removed) return errorResponse('Failed to delete provider', 500);
  return jsonResponse({ success: true, message: 'Provider deleted' });
}
