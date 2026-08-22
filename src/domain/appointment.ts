/**
 * Appointment domain interface.
 */

export interface Appointment {
  id: string;

  patientId: string;            // FK to Patient.id
  providerId: string;           // FK to Provider.id
  locationId?: string;          // FK to Location / ClinicRoom.id

  /** Scheduling */
  status: AppointmentStatus;
  scheduledStart: string;       // ISO-8601 datetime (UTC)
  scheduledEnd: string;         // ISO-8601 datetime (UTC)
  actualStart?: string;         // ISO-8601 datetime (UTC)
  actualEnd?: string;           // ISO-8601 datetime (UTC)

  /** Clinical context (PHI — encrypt at rest if contains notes) */
  visitType: 'routine' | 'follow-up' | 'urgent' | 'procedure' | 'other';
  reasonForVisit?: string;      // PHI
  visitNotes?: string;          // PHI — provider-entered

  /** Billing linkage */
  billingCode?: string;
  insuranceVerified?: boolean;

  /** Audit */
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export type AppointmentStatus =
  | 'scheduled'
  | 'confirmed'
  | 'checked-in'
  | 'in-progress'
  | 'completed'
  | 'cancelled'
  | 'no-show';
