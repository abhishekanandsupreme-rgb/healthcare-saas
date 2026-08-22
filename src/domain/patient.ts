/**
 * Patient domain interface.
 * PHI fields are explicitly named to support field-level encryption and audit logging.
 */

export interface Patient {
  /** Internal UUID (not PHI) */
  id: string;

  /** FHIR-like demographic identifiers */
  firstName: string;
  lastName: string;
  dateOfBirth: string;          // ISO-8601 (YYYY-MM-DD)
  biologicalSexAtBirth: 'male' | 'female' | 'other' | 'unknown';

  /** Contact (PHI — encrypt at rest) */
  email?: string;
  phone?: string;
  address?: Address;

  /** Insurance / eligibility (PHI — encrypt at rest) */
  insuranceMemberId?: string;
  insuranceProvider?: string;
  insuranceGroupNumber?: string;

  /** Clinical flags */
  allergies?: Allergy[];
  primaryProviderId?: string;   // FK to Provider.id

  /** Audit */
  createdAt: string;            // ISO-8601 datetime
  updatedAt: string;            // ISO-8601 datetime
  createdBy: string;            // User.id
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;              // ISO 3166-1 alpha-2
}

export interface Allergy {
  substance: string;
  reaction?: string;
  severity: 'mild' | 'moderate' | 'severe';
  onsetDate?: string;           // ISO-8601 date
}
