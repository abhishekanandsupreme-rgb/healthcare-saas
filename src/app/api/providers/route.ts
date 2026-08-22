import { providers } from '@/lib/store';
import { jsonResponse, errorResponse, getBody } from '@/lib/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const specialty = searchParams.get('specialty');
  const acceptingNew = searchParams.get('acceptingNewPatients');

  if (id) {
    const provider = providers.getById(id);
    if (!provider) return errorResponse('Provider not found', 404);
    return jsonResponse(provider);
  }

  let results = providers.getAll();
  if (specialty) {
    results = results.filter((p) => p.specialty.toLowerCase().includes(specialty.toLowerCase()));
  }
  if (acceptingNew !== null) {
    results = results.filter((p) => p.acceptingNewPatients === (acceptingNew === 'true'));
  }
  return jsonResponse(results);
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

    const id = `prov-${Date.now()}`;
    const now = new Date().toISOString();

    const provider = {
      id,
      firstName: body.firstName,
      lastName: body.lastName,
      npi: body.npi,
      dea: body.dea,
      licenseNumber: body.licenseNumber,
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
      createdAt: now,
      updatedAt: now,
      createdBy: 'api-user',
    };

    providers.create(provider);
    return jsonResponse(provider, 201);
  } catch {
    return errorResponse('Invalid request body', 400);
  }
}
