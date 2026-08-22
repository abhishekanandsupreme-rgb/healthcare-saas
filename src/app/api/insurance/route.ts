import { insuranceRecords, patients } from '@/lib/store';
import { jsonResponse, errorResponse, getBody } from '@/lib/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const patientId = searchParams.get('patientId');

  if (id) {
    const record = insuranceRecords.find((r) => r.id === id);
    if (!record) return errorResponse('Insurance record not found', 404);
    return jsonResponse(record);
  }

  if (patientId) {
    const record = insuranceRecords.find((r) => r.patientId === patientId);
    if (!record) return errorResponse('Insurance record not found for patient', 404);
    return jsonResponse(record);
  }

  return jsonResponse(insuranceRecords);
}

export async function POST(request: Request) {
  try {
    const body = await getBody<{
      patientId: string;
      insuranceProvider: string;
      memberId: string;
      groupNumber: string;
      coverageStart?: string;
      coverageEnd?: string;
      copayAmount?: number;
    }>(request);

    // Verify against patient
    const patient = patients.getById(body.patientId);
    if (!patient) return errorResponse('Patient not found', 404);

    // Simulate eligibility verification
    const existingIndex = insuranceRecords.findIndex((r) => r.patientId === body.patientId);
    const now = new Date().toISOString();
    const defaultStart = body.coverageStart || new Date().toISOString().split('T')[0];
    const defaultEnd = body.coverageEnd || '2025-12-31';

    const record = {
      id: existingIndex >= 0 ? insuranceRecords[existingIndex].id : `ins-${Date.now()}`,
      patientId: body.patientId,
      insuranceProvider: body.insuranceProvider,
      memberId: body.memberId,
      groupNumber: body.groupNumber,
      eligibilityStatus: 'active' as const,
      coverageStart: defaultStart,
      coverageEnd: defaultEnd,
      copayAmount: body.copayAmount ?? 25,
      deductibleRemaining: 1000,
      verifiedAt: now,
    };

    if (existingIndex >= 0) {
      insuranceRecords[existingIndex] = record;
    } else {
      insuranceRecords.push(record);
    }

    // Also update patient record
    patients.update(body.patientId, {
      insuranceProvider: body.insuranceProvider,
      insuranceMemberId: body.memberId,
      insuranceGroupNumber: body.groupNumber,
    });

    return jsonResponse({
      ...record,
      verified: true,
      message: 'Insurance eligibility verified successfully',
    });
  } catch {
    return errorResponse('Invalid request body', 400);
  }
}
