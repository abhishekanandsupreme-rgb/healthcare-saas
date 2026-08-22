import { patients } from '@/lib/store';
import { jsonResponse, errorResponse, getBody } from '@/lib/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (id) {
    const patient = patients.getById(id);
    if (!patient) return errorResponse('Patient not found', 404);
    return jsonResponse(patient);
  }
  return jsonResponse(patients.getAll());
}

export async function POST(request: Request) {
  try {
    const body = await getBody<{
      firstName: string;
      lastName: string;
      dateOfBirth: string;
      biologicalSexAtBirth: 'male' | 'female' | 'other' | 'unknown';
      email?: string;
      phone?: string;
      address?: {
        line1: string;
        line2?: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
      };
      insuranceMemberId?: string;
      insuranceProvider?: string;
      insuranceGroupNumber?: string;
      allergies?: { substance: string; reaction?: string; severity: 'mild' | 'moderate' | 'severe'; onsetDate?: string }[];
      primaryProviderId?: string;
    }>(request);

    const id = `pt-${Date.now()}`;
    const now = new Date().toISOString();

    const patient = {
      id,
      firstName: body.firstName,
      lastName: body.lastName,
      dateOfBirth: body.dateOfBirth,
      biologicalSexAtBirth: body.biologicalSexAtBirth,
      email: body.email,
      phone: body.phone,
      address: body.address,
      insuranceMemberId: body.insuranceMemberId,
      insuranceProvider: body.insuranceProvider,
      insuranceGroupNumber: body.insuranceGroupNumber,
      allergies: body.allergies || [],
      primaryProviderId: body.primaryProviderId,
      createdAt: now,
      updatedAt: now,
      createdBy: 'api-user',
    };

    patients.create(patient);
    return jsonResponse(patient, 201);
  } catch {
    return errorResponse('Invalid request body', 400);
  }
}
