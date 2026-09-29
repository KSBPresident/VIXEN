# VIXEN 1.0 Architecture

This document defines VIXEN's internal system boundaries. These names describe the implementation and operating model; they are not public-facing product navigation or marketing copy.

## System layers

### TOP / EXECUTIVE OS

Owns platform-wide policy, governance, operational controls, release approvals, moderation and finance oversight, audit review, and incident/rollback decisions. It coordinates administration and platform configuration. It must not bypass the authorization and audit requirements of lower layers.

### MIDDLE OS

Owns product workflows and orchestration: account onboarding, creator publishing, member discovery, memberships, messages, purchases, wallet operations, rewards, notifications, and support. It coordinates Front OS requests with Kernel rules and Back OS adapters.

### BACK OS

Owns infrastructure and external-service adapters: Supabase persistence and authentication, an approved payment processor and its events, storage, email, LLM providers, CRM connections, n8n workflows, observability, and scheduled jobs. Secrets stay server-side. Adapters validate inputs, normalize errors, and never decide product entitlements independently.

### VIXEN KERNEL

Owns the stable domain model and authoritative rules: identities and roles, creator/member relationships, entitlements, package limits, money calculations, ledger invariants, purchase/subscription state transitions, rewards eligibility, journey rules, and audit event contracts. Core rules should be deterministic and tested without network access. The Kernel is the source of truth for authorization and financial decisions.

### FRONT OS

Owns user-facing Next.js App Router pages, layouts, components, interaction states, accessibility, and presentation. It presents public discovery, creator and member experiences, creator studio, and authorized administration. It calls Middle OS workflows through typed server actions/API boundaries and never treats browser state as authority for access, money, or entitlements.

## Dependency direction

```text
TOP / EXECUTIVE OS
          |
       MIDDLE OS
       /       \
FRONT OS     BACK OS
       \       /
      VIXEN KERNEL
```

The direction above describes responsibility, not permission to couple every layer directly. Front OS may render data returned by Middle OS; Back OS provides adapters to Middle OS; both rely on Kernel contracts. No browser bundle may contain provider secrets or write directly around the Kernel's authorization and ledger rules.

## Repository mapping

Keep the current Next.js App Router and evolve it incrementally:

- `app/(public)` and public UI components belong to Front OS.
- `app/(protected)`, `app/admin`, and their layouts belong to Front OS; protected access must also be enforced server-side.
- `app/api` is a transport boundary for Middle OS workflows, webhooks, and health/operational endpoints.
- `lib/application` contains Middle OS use cases and orchestration.
- `lib/kernel` contains domain types, policies, access decisions, money rules, ledgers, rewards, and state transitions.
- `lib/adapters` contains Back OS integrations for Supabase, an approved payments provider, n8n, LLMs, CRM, mail, storage, and observability.
- `app/admin` plus audited admin use cases implement TOP / EXECUTIVE OS; never rely on hidden UI controls as authorization.
- `supabase/migrations` and policy SQL define persisted state and database-enforced access. They must agree with Kernel contracts.
- `docs` records architecture, contracts, threat model, operational runbooks, and release evidence.
- `docs/ARCHITECTURE_IMPLEMENTATION_STATUS.md` distinguishes the implemented five-layer foundation from features and integrations still pending.

These are intended boundaries. Do not claim a boundary or feature is implemented until its code, migrations, and checks exist.

## Production invariants

1. Every user- or service-supplied input is validated at the boundary.
2. Server-side identity is verified before authorization; UI visibility alone is never an access control.
3. Money is represented in integer minor units and recorded through an auditable, idempotent ledger.
4. Payment-provider webhook signatures are verified and event effects are idempotent. The selected provider must explicitly approve VIXEN's adult content, adult live video, storefront, and target markets before integration.
5. Supabase RLS is enabled for user-owned data, with least-privilege service-role usage.
6. n8n and LLM calls use server-side credentials, bounded retries, timeouts, and safe error states.
7. Sensitive administrative actions produce an audit record.
8. No production capability is advertised as active until environment configuration and end-to-end verification succeed.
9. CI gates lint, type checking, tests, and a production build; production changes follow review and rollback procedures.
