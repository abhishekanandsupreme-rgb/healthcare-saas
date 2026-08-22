import { checkInRecords, appointments, patients } from '@/lib/store';
import { jsonResponse, errorResponse, getBody } from '@/lib/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const appointmentId = searchParams.get('appointmentId');
  const patientId = searchParams.get('patientId');

  let results = checkInRecords;
  if (appointmentId) {
    results = results.filter((c) => c.appointmentId === appointmentId);
  }
  if (patientId) {
    results = results.filter((c) => c.patientId === patientId);
  }
  return jsonResponse(results);
}

export async function POST(request: Request) {
  try {
    const body = await getBody<{ appointmentId: string; notes?: string }>(request);

    const appointment = appointments.getById(body.appointmentId);
    if (!appointment) return errorResponse('Appointment not found', 404);

    const patient = patients.getById(appointment.patientId);
    if (!patient) return errorResponse('Patient not found', 404);

    const id = `ci-${Date.now()}`;
    const now = new Date().toISOString();

    const checkIn: typeof checkInRecords[0] = {
      id,
      appointmentId: body.appointmentId,
      patientId: appointment.patientId,
      checkedInAt: now,
      status: 'checked-in',
      notes: body.notes,
    };

    checkInRecords.push(checkIn);

    // Update appointment status
    appointments.update(body.appointmentId, {
      status: 'checked-in',
      actualStart: now,
      updatedAt: now,
    });

    return jsonResponse(checkIn, 201);
  } catch {
    return errorResponse('Invalid request body', 400);
  }
}
