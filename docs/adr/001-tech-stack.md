# ADR-001: MVP Tech Stack

## Status
Accepted

## Context
We need to ship a 15-day MVP for a telehealth / clinic management SaaS with zero upfront hosting/tooling spend. The stack must support HIPAA-compliant data handling, rapid prototyping, and easy onboarding for pilot clinics.

## Decision
Use the following stack for the MVP:

| Layer       | Choice                              | Rationale                                                                 |
|-------------|-------------------------------------|---------------------------------------------------------------------------|
| Frontend    | Next.js 14 + React + TypeScript     | App Router, SSR/SSG, strong TypeScript support, fast dev with Turbopack  |
| UI          | Tailwind CSS + shadcn/ui            | Low-friction styling, accessible primitives, fast iteration               |
| Backend     | Next.js API Routes (tRPC planned)   | Monorepo-friendly, same deploy target, easy to split later               |
| Database    | PostgreSQL (Neon / Supabase free tier) | Managed Postgres with point-in-time recovery, HIPAA-eligible plans       |
| ORM         | Prisma                              | Type-safe schema, migration management, strong DX                        |
| Auth        | NextAuth.js v5 (Auth.js)            | Built-in OAuth/credentials, BAA-capable providers                        |
| Payments    | Stripe Connect                     | Payouts to clinics, subscription + transaction fees, HIPAA addendum      |
| Hosting     | Vercel Pro (free tier for MVP)      | Edge network, Git-based deploys, BAA available for HIPAA workloads      |
| Monitoring  | Vercel Analytics + Sentry          | Error tracking + performance, business associate addendum                |

## Consequences
- **Positive:** Minimal operational overhead, single deploy pipeline, type safety across stack.
- **Negative:** API Routes max out at 10s; heavy jobs should move to a queue/worker later.
- **Mitigation:** Plan to extract long-running tasks (eligibility checks, claims submission) to background workers in Phase 1.

## Alternatives Considered
1. **Ruby on Rails** — great DX, but slower cold starts on serverless and smaller TypeScript talent pool.
2. **Firebase** — fast to start, but HIPAA BAA requires upgrade and vendor lock-in risk is higher.
