/**
 * Provider domain interface.
 */

export interface Provider {
  id: string;

  /** Identity (PHI) */
  firstName: string;
  lastName: string;
  npi?: string;                 // National Provider Identifier (10 digits)
  dea?: string;                 // Drug Enforcement Administration number (PHI)
  licenseNumber?: string;
  licenseState?: string;

  /** Professional */
  specialty: string;            // e.g. "Family Medicine", "Pediatrics"
  acceptingNewPatients: boolean;
  maxDailyAppointments: number;

  /** Contact (PHI) */
  email: string;
  phone?: string;
  title?: string;               // e.g. "MD", "DO", "NP", "PA"
  pronouns?: string;

  /** Scheduling defaults */
  defaultSlotDurationMinutes: number;
  bufferMinutesBetweenAppointments: number;

  /** Audit */
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}
