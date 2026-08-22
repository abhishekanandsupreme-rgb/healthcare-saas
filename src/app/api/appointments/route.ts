import { appointments } from '@/lib/store';
import { jsonResponse, errorResponse, getBody } from '@/lib/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const patientId = searchParams.get('patientId');
  const providerId = searchParams.get('providerId');

  if (id) {
    const appointment = appointments.getById(id);
    if (!appointment) return errorResponse('Appointment not found', 404);
    return jsonResponse(appointment);
  }

  let results = appointments.getAll();
  if (patientId) {
    results = results.filter((a) => a.patientId === patientId);
  }
  if (providerId) {
    results = results.filter((a) => a.providerId === providerId);
  }
  return jsonResponse(results);
}

export async function POST(request: Request) {
  try {
    const body = await getBody<{
      patientId: string;
      providerId: string;
      locationId?: string;
      status?: 'scheduled' | 'confirmed' | 'checked-in' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
      scheduledStart: string;
      scheduledEnd: string;
      visitType: 'routine' | 'follow-up' | 'urgent' | 'procedure' | 'other';
      reasonForVisit?: string;
      visitNotes?: string;
      billingCode?: string;
    }>(request);

    const id = `apt-${Date.now()}`;
    const now = new Date().toISOString();

    const appointment = {
      id,
      patientId: body.patientId,
      providerId: body.providerId,
      locationId: body.locationId,
      status: body.status || 'scheduled',
      scheduledStart: body.scheduledStart,
      scheduledEnd: body.scheduledEnd,
      visitType: body.visitType,
      reasonForVisit: body.reasonForVisit,
      visitNotes: body.visitNotes,
      billingCode: body.billingCode,
      insuranceVerified: false,
      createdAt: now,
      updatedAt: now,
      createdBy: 'api-user',
    };

    appointments.create(appointment);
    return jsonResponse(appointment, 201);
  } catch {
    return errorResponse('Invalid request body', 400);
  }
}
