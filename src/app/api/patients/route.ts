import { prisma } from '@/lib/prisma';
import { jsonResponse, errorResponse, getBody } from '@/lib/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (id) {
    const patient = await prisma.patient.findUnique({ where: { id } });
    if (!patient) return errorResponse('Patient not found', 404);
    return jsonResponse(patient);
  }
  const patients = await prisma.patient.findMany({ orderBy: { createdAt: 'desc' } });
  return jsonResponse(patients);
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

    const now = new Date();
    const patient = await prisma.patient.create({
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        dateOfBirth: new Date(body.dateOfBirth),
        gender: body.biologicalSexAtBirth,
        email: body.email,
        phone: body.phone,
        address: body.address ? JSON.parse(JSON.stringify(body.address)) : null,
        city: body.address?.city,
        state: body.address?.state,
        zipCode: body.address?.postalCode,
        allergies: body.allergies ? JSON.parse(JSON.stringify(body.allergies)) : null,
        insuranceMemberId: body.insuranceMemberId,
        insuranceProvider: body.insuranceProvider,
        insuranceGroupNumber: body.insuranceGroupNumber,
        primaryProviderId: body.primaryProviderId,
        createdBy: 'api-user',
        createdAt: now,
        updatedAt: now,
      },
    });

    return jsonResponse(patient, 201);
  } catch (err) {
    console.error('POST /api/patients error:', err);
    return errorResponse('Invalid request body', 400);
  }
}