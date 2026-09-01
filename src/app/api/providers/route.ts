import { prisma } from '@/lib/prisma';
import { jsonResponse, errorResponse, getBody } from '@/lib/store';
import type { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const specialty = searchParams.get('specialty');
  const acceptingNew = searchParams.get('acceptingNewPatients');

  if (id) {
    const provider = await prisma.provider.findUnique({ where: { id } });
    if (!provider) return errorResponse('Provider not found', 404);
    return jsonResponse(provider);
  }

  const where: Prisma.ProviderWhereInput = {};
  if (specialty) {
    where.specialty = { contains: specialty, mode: 'insensitive' };
  }
  if (acceptingNew !== null) {
    where.acceptingNewPatients = acceptingNew === 'true';
  }

  const providers = await prisma.provider.findMany({ where, orderBy: { createdAt: 'desc' } });
  return jsonResponse(providers);
}

export async function POST(request: Request) {
  try {
    const body = await getBody<{
      firstName: string;
      lastName: string;
      npi?: string;
      dea?: string;
      licenseNumber?: string;
      licenseState?: string;
      specialty: string;
      acceptingNewPatients: boolean;
      maxDailyAppointments: number;
      email: string;
      phone?: string;
      title?: string;
      pronouns?: string;
      defaultSlotDurationMinutes: number;
      bufferMinutesBetweenAppointments: number;
    }>(request);

    const now = new Date();
    const provider = await prisma.provider.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        npi: body.npi,
        dea: body.dea,
        license: body.licenseNumber,
        licenseState: body.licenseState,
        specialty: body.specialty,
        acceptingNewPatients: body.acceptingNewPatients,
        maxDailyAppointments: body.maxDailyAppointments,
        email: body.email,
        phone: body.phone,
        title: body.title,
        pronouns: body.pronouns,
        defaultSlotDurationMinutes: body.defaultSlotDurationMinutes,
        bufferMinutesBetweenAppointments: body.bufferMinutesBetweenAppointments,
        createdBy: 'api-user',
        createdAt: now,
        updatedAt: now,
      },
    });

    return jsonResponse(provider, 201);
  } catch (err) {
    console.error('POST /api/providers error:', err);
    return errorResponse('Invalid request body', 400);
  }
}