import { prisma } from '@/lib/prisma';
import { jsonResponse, errorResponse } from '@/lib/store';

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const provider = await prisma.provider.findUnique({ where: { id: params.id } });
  if (!provider) return errorResponse('Provider not found', 404);
  return jsonResponse(provider);
}

export async function PUT(_request: Request, { params }: { params: { id: string } }) {
  const existing = await prisma.provider.findUnique({ where: { id: params.id } });
  if (!existing) return errorResponse('Provider not found', 404);

  const body = await _request.json();
  const updated = await prisma.provider.update({
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
  const exists = await prisma.provider.findUnique({ where: { id: params.id } });
  if (!exists) return errorResponse('Provider not found', 404);

  await prisma.provider.delete({ where: { id: params.id } });
  return jsonResponse({ success: true, message: 'Provider deleted' });
}