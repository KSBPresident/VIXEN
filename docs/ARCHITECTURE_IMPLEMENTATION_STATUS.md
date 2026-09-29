# VIXEN five-layer implementation status

The requested TOP / EXECUTIVE OS, MIDDLE OS, BACK OS, VIXEN KERNEL, and FRONT OS model is the internal architecture for this VIXEN project. It is not visitor-facing navigation.

## Current code foundation

- **TOP / EXECUTIVE OS** — `lib/executive/platform-readiness.ts` records evidence gates and evaluates whether a capability has the proof needed for release. Admin, moderation, finance, and audit dashboards remain to be built.
- **MIDDLE OS** — `lib/application/` contains pricing, an audited creator-content access workflow, and a tested private-video join workflow. The join workflow verifies identity and booking, applies the Kernel policy, requires durable audit, and then requests a short-lived participant credential. No video provider is connected.
- **BACK OS** — `lib/adapters/service-contracts.ts` defines server-side service boundaries. No Supabase, payment, storage, n8n, email, LLM, or video provider adapter is connected in this website-first phase. Payment confirmation and video room credentials must come from trusted server integrations. The new ports define that boundary; they do not supply an implementation.
- **VIXEN KERNEL** — `lib/kernel/` owns illustrative membership prices, verified role types, creator content access decisions, a tested private-video join policy, and audit-event contracts. The private-video policy fails closed unless an active adult-verified member or the booked creator joins the matching creator-accepted, paid booking inside its scheduled window. Ledger, rewards, journey, and further domain rules remain to be built and tested before activation.
- **FRONT OS** — the existing Next.js App Router under `app/` renders VIXEN pages. The public homepage links to `/about`, which shows the supplied Nine Tail Fox mascot and its parent-company relationship. `/member-preview` links to visual message and private-video session previews, filters its sample creator feed by name, handle, category, title, or description, and routes sample Follow actions to member sign-up. The filter and links do not create accounts, persisted follows, messages, bookings, or payments; messages and private-video preview screens route search to creator discovery. `/creator/studio` is a responsive visual preview of profile, content/drop, memberships, messaging, sessions, and earnings areas; none of those creator tools save, publish, or process money. All profiles, conversations, and session cards remain sample UI; messaging, checkout, bookings, and video rooms are not live. Device camera/microphone access must happen only after the participant chooses to join and the browser grants permission.

The join workflow does not access camera or microphone devices. Only the browser can request device permission, after the member explicitly continues from a successfully authorized session screen. Provider credentials are participant-bound, short-lived (at most three minutes), and must never be logged or exposed before authorization.

## Dependency rules

1. Front OS pages call Middle OS use cases; they do not own business prices or entitlement rules.
2. Middle OS workflows call Kernel rules and Back OS interfaces.
3. Back OS implementations must not make independent authorization, price, or entitlement decisions.
4. TOP / Executive OS gates production capabilities and sensitive operations; hiding a control in the UI is not authorization.
5. No capability is marked active without its required operational and end-to-end evidence. `privateVideoSessions` remains planned until payment, signaling, consent, moderation, and cross-device verification are live.
6. The browser requests camera and microphone only after an eligible participant explicitly enters a paid session; denying either permission must not silently bypass the prompt or expose private media.

## Deferred work

Supabase and n8n remain intentionally disconnected until the website experience is ready. Payment providers, member authentication, creator onboarding, messaging, and payouts also remain previews or planned. This file describes the implemented foundation and must be updated as each layer is completed.
