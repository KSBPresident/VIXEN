# VIXEN seven-layer implementation status

The requested TOP / EXECUTIVE OS, MIDDLE OS, BACK OS, WEB3 OS, VIXEN STORE OS, VIXEN KERNEL, and FRONT OS model is the internal architecture for this VIXEN project. It is not visitor-facing navigation.

## Latest deployed status · 2026-10-18

PR #73 is merged and deployed to production. Approved creators can edit their public username, display name, bio, profile image, and cover image. The profile media path uses direct browser-to-Supabase Storage TUS uploads, capped at 45 MiB, with progress, retry, and browser-session resume support. Storage policies restrict profile media writes to the authenticated approved creator's own path; profile-column grants prevent changing creator status. Public creator pages render approved public fields. CI and deployment are verified, but a real authenticated media upload has not been exercised end to end.

Feed posts and stories remain unmerged and are not deployed. The current PR #71 draft exposes feed/story media through public storage and anonymous discovery without adequate age, membership, or per-post access enforcement. Do not merge that migration or expose adult creator media publicly until the database policies and product access model are redesigned and reviewed.

## Current code foundation

- **TOP / EXECUTIVE OS** — `lib/executive/platform-readiness.ts` records evidence gates and evaluates whether a capability has the proof needed for release. Admin, moderation, finance, and audit dashboards remain to be built.
- **MIDDLE OS** — `lib/application/` contains pricing, an audited creator-content access workflow, and a tested private-video join workflow. The join workflow verifies identity and booking, applies the Kernel policy, requires durable audit, and then requests a short-lived participant credential. No video provider is connected.
- **BACK OS** — `lib/adapters/service-contracts.ts` defines server-side service boundaries. Supabase Auth is connected for VIXEN email/password signup, sign-in, callback/session exchange, protected account access, and password recovery. The password-recovery flow is covered by CI and its public unauthenticated route redirects safely; actual reset-email delivery and a full token-to-password-change cycle still need live end-to-end verification. Proton addresses are accepted as email addresses, not as Proton OAuth. Application data persistence and adapters for payments, commerce, creator storage, n8n, LLMs, and video are not established as active. Payment confirmation and video room credentials must come from trusted server integrations.
- **WEB3 OS** — the chain/wallet boundary is documented; no blockchain network, NINE token contract, wallet provider, transaction verifier, settlement ledger, or on-chain payment path is connected. Chain balances and browser-submitted hashes do not grant access.
- **VIXEN STORE OS** — `lib/store-os/quote.ts` provides deterministic store subtotal quotes from trusted catalog IDs, quantities, currency, and integer minor-unit prices. No live catalog, stock, cart persistence, tax/shipping calculation, checkout, payment, order persistence, or fulfillment connection exists.
- **VIXEN KERNEL** — `lib/kernel/` owns illustrative membership prices, tested NINE subscription-preview cent rounding, verified role types, creator content access decisions, a tested private-video join policy, and audit-event contracts. The private-video policy fails closed unless an active adult-verified member or the booked creator joins the matching creator-accepted, paid booking inside its scheduled window. Ledger, rewards, journey, and further domain rules remain to be built and tested before activation.
- **FRONT OS** — Production currently runs main commit `f1a007908d128aa7c666d0f8e80bd4d0b8513783`; the approved-creator profile editor is deployed, with 45 MiB resumable TUS image uploads. The production creator signup route returns HTTP 200 and describes account/profile, identity, and payout/tax stages, but identity/payout providers are not connected and no raw sensitive documents should be collected. The remaining illustrative flows, sample creators, and preview-only actions described below have not become live merely because this deployment is READY. The member feed/story PR is still unmerged; it is not part of production.

The join workflow does not access camera or microphone devices. Only the browser can request device permission, after the member explicitly continues from a successfully authorized session screen. Provider credentials are participant-bound, short-lived (at most three minutes), and must never be logged or exposed before authorization.

## Dependency rules

1. Front OS pages call Middle OS use cases; they do not own prices or entitlements.
2. Middle OS coordinates VIXEN Store OS for commerce workflows, Web3 OS for chain evidence, VIXEN Kernel for shared policy, and Back OS interfaces for external effects.
3. Web3 OS verifies settlement through trusted adapters and cannot grant access by itself. Store OS does not trust browser-supplied prices or payment status. Kernel rules decide shared authorization and entitlement.
4. TOP / Executive OS gates production capabilities and sensitive operations; hiding a control in the UI is not authorization.
5. No capability is marked active without operational and end-to-end evidence. Private video remains planned until payment, signaling, consent, moderation, and cross-device verification are live.
6. The browser requests camera and microphone only after an eligible participant explicitly enters a paid session; denying either permission must not silently bypass the prompt or expose private media.

## Deferred work

Supabase Auth is now connected for email/password account access. The wider Supabase application-data layer and n8n remain unimplemented. Payment processing, creator onboarding and publishing, real messaging, paid content, checkout, bookings, video rooms, and payouts remain previews or planned. Do not advertise them as active until their adapters, authorization policies, operational configuration, and end-to-end checks are in place. This file should be updated as each layer is completed.
