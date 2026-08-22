# Landing Page — 15-Day MVP Tracer-Bullet Tickets

## Tracer-Bullet Philosophy
Each ticket is a thin, end-to-end slice that delivers value to pilot clinics and validates architecture. We build vertical slices, not horizontal layers.

---

### TB-01 — Clinic Admin Onboarding (0–2 days)
**Goal:** Let a clinic admin sign up, accept the terms of service, and create their first provider profile.
- [ ] Landing page with clinic name, admin email, password
- [ ] Email verification (Resend / Nodemailer)
- [ ] Provider creation wizard (name, NPI, specialty)
- [ ] BAA acceptance checkbox
- [ ] Success: admin lands in dashboard with empty provider roster

---

### TB-02 — Provider Schedule Setup (1–3 days)
**Goal:** Define availability windows so patients can see open slots.
- [ ] Provider calendar view (weekly grid)
- [ ] Set recurring availability (Mon–Fri 9–5)
- [ ] Block out lunch / breaks
- [ ] Set max daily appointments
- [ ] Success: public booking page shows available times

---

### TB-03 — Patient Self-Scheduling (2–5 days)
**Goal:** Patients book appointments without calling the clinic.
- [ ] Public booking page (no login required)
- [ ] Select provider → view available slots
- [ ] Enter first/last name, DOB, phone (minimum PHI)
- [ ] Email confirmation with .ics attachment
- [ ] Success: appointment appears in provider's calendar

---

### TB-04 — Appointment Check-In & Status (3–6 days)
**Goal:** Reduce front-desk workload with digital check-in.
- [ ] Patient checks in via link sent 1 hour before appointment
- [ ] Provider sees real-time status (checked-in / in-progress)
- [ ] Basic vitals intake form (optional, PHI-encrypted)
- [ ] Success: provider can mark appointment complete

---

### TB-05 — Basic Visit Note Capture (5–8 days)
**Goal:** Replace paper notes with structured digital entry.
- [ ] Provider enters SOAP note during/after visit
- [ ] Auto-save every 30 seconds
- [ ] Mark note as "final" (immutable)
- [ ] Success: patient summary page shows finalized note

---

### TB-06 — Insurance Eligibility Check (6–9 days)
**Goal:** Validate coverage before the visit.
- [ ] Admin enters insurance member ID + DOB
- [ ] Background job calls eligibility API (mock first, real later)
- [ ] Display: active/inactive, copay amount, deductible remaining
- [ ] Success: appointment flagged with verified/inactive status

---

### TB-07 — Stripe Checkout & Subscription (7–10 days)
**Goal:** Enable clinics to pay for the pilot.
- [ ] Stripe Connect onboarding for clinic bank account
- [ ] Per-provider subscription ($X/provider/month)
- [ ] Transaction fee toggle (2.9% + 30¢ per billing event)
- [ ] Webhook: `invoice.paid` updates subscription status
- [ ] Success: admin sees active subscription in settings

---

### TB-08 — Audit Log & HIPAA Dashboard (9–11 days)
**Goal:** Provide the compliance foundation for BAA auditors.
- [ ] Immutable log table: actor, action, resource, timestamp, IP
- [ ] Admin view: filter by user, date range, PHI access events
- [ ] Export CSV / PDF for auditor review
- [ ] Success: 6-year retention policy enforced

---

### TB-09 — Role-Based Access & Security Hardening (11–13 days)
**Goal:** Lock down PHI access.
- [ ] RBAC middleware: Admin, Provider, Staff, Patient roles
- [ ] Row-level security: providers see only their own appointments
- [ ] MFA enforcement for Admin and Provider roles
- [ ] Session timeout (15 min inactivity)
- [ ] Success: unauthorized access returns 403; audit log captures attempts

---

### TB-10 — Pilot Clinic Data Export & Onboarding Kit (13–15 days)
**Goal:** Hand off a clean, defensible dataset to the first paying clinic.
- [ ] One-click CSV export of patients, appointments, notes
- [ ] PDF "Data Processing Addendum" generator
- [ ] Admin checklist for go-live (BAA signed, payment active, users trained)
- [ ] Success: clinic receives export + DPA within 5 minutes of request

---

## Velocity Check
| Ticket | Est. Days | Cumulative |
|--------|-----------|------------|
| TB-01  | 2         | 2          |
| TB-02  | 2         | 4          |
| TB-03  | 3         | 7          |
| TB-04  | 3         | 10         |
| TB-05  | 3         | 13         |
| TB-06  | 3         | 16         |
| TB-07  | 3         | 19         |
| TB-08  | 2         | 21         |
| TB-09  | 2         | 23         |
| TB-10  | 2         | 25         |

> **Note:** 25 estimated days exceeds the 15-day target. This is intentional: tracer bullets expose real complexity. Prioritize TB-01 through TB-05 for launch; defer TB-06+ to the first week of pilot operations.
