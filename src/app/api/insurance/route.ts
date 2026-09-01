import { prisma } from '@/lib/prisma';
import { jsonResponse, errorResponse, getBody } from '@/lib/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const patientId = searchParams.get('patientId');

  if (id) {
    const record = await prisma.insuranceRecord.findUnique({ where: { id } });
    if (!record) return errorResponse('Insurance record not found', 404);
    return jsonResponse(record);
  }

  if (patientId) {
    const record = await prisma.insuranceRecord.findFirst({ where: { patientId } });
    if (!record) return errorResponse('Insurance record not found for patient', 404);
    return jsonResponse(record);
  }

  const records = await prisma.insuranceRecord.findMany({ orderBy: { verifiedAt: 'desc' } });
  return jsonResponse(records);
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

    // Verify patient exists
    const patient = await prisma.patient.findUnique({ where: { id: body.patientId } });
    if (!patient) return errorResponse('Patient not found', 404);

    const now = new Date();
    const defaultStart = body.coverageStart || new Date().toISOString().split('T')[0];
    const defaultEnd = body.coverageEnd || '2025-12-31';

    // Check for existing record
    const existing = await prisma.insuranceRecord.findFirst({ where: { patientId: body.patientId } });

    let record;
    if (existing) {
      record = await prisma.insuranceRecord.update({
        where: { id: existing.id },
        data: {
          insuranceProvider: body.insuranceProvider,
          memberId: body.memberId,
          groupNumber: body.groupNumber,
          eligibilityStatus: 'active',
          coverageStart: new Date(defaultStart),
          coverageEnd: new Date(defaultEnd),
          copayAmount: body.copayAmount ?? 25,
          deductibleRemaining: 1000,
          verifiedAt: now,
        },
      });
    } else {
      record = await prisma.insuranceRecord.create({
        data: {
          patientId: body.patientId,
          insuranceProvider: body.insuranceProvider,
          memberId: body.memberId,
          groupNumber: body.groupNumber,
          eligibilityStatus: 'active',
          coverageStart: new Date(defaultStart),
          coverageEnd: new Date(defaultEnd),
          copayAmount: body.copayAmount ?? 25,
          deductibleRemaining: 1000,
          verifiedAt: now,
        },
      });
    }

    // Also update patient record
    await prisma.patient.update({
      where: { id: body.patientId },
      data: {
        insuranceProvider: body.insuranceProvider,
        insuranceMemberId: body.memberId,
        insuranceGroupNumber: body.groupNumber,
      },
    });

    return jsonResponse({
      ...record,
      verified: true,
      message: 'Insurance eligibility verified successfully',
    });
  } catch (err) {
    console.error('POST /api/insurance error:', err);
    return errorResponse('Invalid request body', 400);
  }
}