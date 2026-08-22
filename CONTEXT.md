# Healthcare SaaS

## Domain
- Telehealth / clinic management
- Patient scheduling, intake, visit notes
- Billing, insurance eligibility, claims
- Compliance: HIPAA, HITRUST, SOC 2, state medical-board rules

## Users
- Clinic admin
- Provider / nurse / staff
- Patient
- Payer / billing user

## Business Model
- Subscription + per-provider + transaction fees
- Freemium / pilot clinic first

## Launch Goal
- MVP in 15 days
- First paying clinic pilot
- Zero upfront hosting/tooling spend

## First Sprint Goals (Tracer-Bullet TB-01 through TB-05)
- **Sprint Duration:** 13 days (cumulative estimate)
- **Focus:** UI vertical slice — landing page + core feature surface
- **Deliverables:**
  - Marketing landing page (hero, features, pricing, CTA) implemented in Next.js 14 with Tailwind CSS
  - TB-01: Clinic admin onboarding scaffold — landing page captures lead intent (UI-only)
  - TB-02: Provider schedule setup — feature section highlights availability windows
  - TB-03: Patient self-scheduling — feature section highlights public booking
  - TB-04: Appointment check-in & status — feature section highlights digital check-in
  - TB-05: Basic visit note capture — feature section highlights structured notes
- **Out of Scope (deferred to post-sprint):**
  - Real authentication, database, Stripe integration, email delivery, insurance API
  - TB-06 through TB-10 (billing, audit logs, RBAC, data export)
- **Next Steps:** After landing page + UI slice, wire up a minimal Next.js app router, add auth scaffolding (NextAuth), and begin TB-01 form implementation.
