# Domain Docs

This repo uses **single-context** domain documentation.

## Layout

- Root `CONTEXT.md` — project context, domain terms, and launch plan
- `docs/adr/` — architecture decision records

## Consumer Rules

- Agents should read `CONTEXT.md` before starting work to understand domain terms.
- ADRs are append-only; do not rewrite old decisions, add new ones instead.
- Keep healthcare compliance terms explicit: HIPAA, HITRUST, SOC 2, state medical-board rules.
