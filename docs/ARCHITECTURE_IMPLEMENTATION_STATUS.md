# VIXEN five-layer implementation status

The requested TOP / EXECUTIVE OS, MIDDLE OS, BACK OS, VIXEN KERNEL, and FRONT OS model is the internal architecture for this VIXEN project. It is not visitor-facing navigation.

## Current code foundation

- **TOP / EXECUTIVE OS** — `lib/executive/platform-readiness.ts` records evidence gates and evaluates whether a capability has the proof needed for release. Admin, moderation, finance, and audit dashboards remain to be built.
- **MIDDLE OS** — `lib/application/` contains pricing and an audited creator-content access workflow. Other member, creator publishing, moderation, messaging, and commerce workflows remain to be implemented.
- **BACK OS** — `lib/adapters/service-contracts.ts` defines server-side service boundaries. No Supabase, payments, storage, n8n, email, or LLM adapter is connected in this website-first phase.
- **VIXEN KERNEL** — `lib/kernel/` owns illustrative membership prices, verified role types, creator content access decisions, and audit-event contracts. Ledger, rewards, journey, and further domain rules remain to be built and tested before activation.
- **FRONT OS** — the existing Next.js App Router under `app/` renders VIXEN pages. The pricing page now reads its plan examples through MIDDLE OS and KERNEL instead of maintaining duplicate prices in the UI.

## Dependency rules

1. Front OS pages call Middle OS use cases; they do not own business prices or entitlement rules.
2. Middle OS workflows call Kernel rules and Back OS interfaces.
3. Back OS implementations must not make independent authorization, price, or entitlement decisions.
4. TOP / Executive OS gates production capabilities and sensitive operations; hiding a control in the UI is not authorization.
5. No capability is marked active without its required operational and end-to-end evidence.

## Deferred work

Supabase and n8n remain intentionally disconnected until the website experience is ready. Payment providers, member authentication, creator onboarding, messaging, and payouts also remain previews or planned. This file describes the implemented foundation and must be updated as each layer is completed.
