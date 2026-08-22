# ADR-002: HIPAA Compliance Strategy

## Status
Accepted

## Context
The MVP handles Protected Health Information (PHI): patient demographics, appointment details, visit notes, and billing data. We must meet HIPAA requirements without slowing the 15-day launch. We also need a clear path to HITRUST and SOC 2.

## Decision
Adopt a **"compliance by design, default deny"** approach layered across four pillars:

### 1. Administrative Safeguards
- **BAAs** in place with every vendor that touches PHI (Neon, Vercel, Stripe, Sentry).
- **Policies** documented in `docs/compliance/`: Privacy, Security, Breach Notification, Access Control.
- **Training** log for any human with PHI access (even founders).

### 2. Physical & Technical Safeguards
- **Encryption at rest:** Database-level encryption via managed provider; field-level encryption for SSN / insurance IDs using AES-256-GCM with a key rotation schedule.
- **Encryption in transit:** TLS 1.3 everywhere; HSTS enabled; no HTTP fallback.
- **Access control:** RBAC mapped to user roles (Admin, Provider, Staff, Patient). Least-privilege by default.
- **Audit logging:** Every PHI read/write/delete emits an immutable log entry (actor, action, resource, timestamp, IP). Stored in a separate, append-only table with 6-year retention.

### 3. Data Minimization & Retention
- Collect only necessary PHI fields; use `Patient` interface with optional `insuranceMemberId` instead of cloning full insurance cards.
- Automatic 6-year retention for medical records; explicit purge API for patient deletion requests (with legal hold flag).

### 4. Incident Response
- Breach detection via Sentry alerts + daily log review.
- 60-day breach notification runbook in `docs/compliance/breach-runbook.md`.

## Consequences
- **Positive:** Clear audit trail, defensible posture for BAA auditors, low ongoing cost.
- **Negative:** Extra dev time for field encryption and audit logs; not all HIPAA requirements can be fully tested in 15 days.
- **Mitigation:** Ship with "HIPAA-ready" architecture and schedule a formal audit in Week 2. Flag gaps explicitly in `docs/compliance/gap-analysis.md`.

## Alternatives Considered
1. **Delay compliance** until post-MVP — rejected because BAA onboarding alone takes 5-10 business days with some vendors.
2. **Full HITRUST from day one** — rejected because scope would blow past the 15-day window; instead build the foundation and expand later.
