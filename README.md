# VIXEN

A creator-first platform built with the Next.js App Router and TypeScript. The public experience follows the supplied VIXEN brand direction and keeps the home page focused on discovery and account creation.

## Canonical implementation plan

See [docs/PRODUCT_REQUIREMENTS_TIMELINE.md](docs/PRODUCT_REQUIREMENTS_TIMELINE.md) for the authoritative implementation sequence and acceptance gates. The internal system boundaries are documented in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

## Run locally

- Node.js 22 or newer
- Copy `.env.example` to `.env.local` and add the Supabase project URL and publishable key.
- `npm install`
- `npm run dev`

Open http://localhost:3000.

## OAuth setup

The Google, Apple, and Microsoft options use Supabase Auth OAuth. Follow [docs/AUTH_SETUP.md](docs/AUTH_SETUP.md) to configure provider applications, Supabase redirect URLs, and Vercel environment variables. Provider credentials belong in Supabase Auth settings; do not commit them.

## Production checks

- `npm run lint`
- `npm run typecheck`
- `npm run build`

OAuth buttons remain unavailable until the public Supabase URL and publishable key are configured. Provider setup must also be completed in Supabase before sign-in can succeed.


## VIXEN seven-layer architecture

These names describe internal system responsibilities, not visitor-facing navigation:

1. **TOP / EXECUTIVE OS** — governance, operations, review, audit, and release gates.
2. **MIDDLE OS** — account, creator, membership, messaging, purchase, notification, and support workflows.
3. **BACK OS** — Supabase, payment, storage, email, LLM, CRM, n8n, fulfillment, and observability adapters.
4. **WEB3 OS** — wallet proofs and blockchain settlement verification, isolated behind chain-specific adapters.
5. **VIXEN STORE OS** — storefront catalog, cart, offers, quotes, orders, and fulfillment workflows.
6. **VIXEN KERNEL** — trusted identity, roles, access, entitlements, money invariants, and shared product policy.
7. **FRONT OS** — the responsive Next.js web app and accessible user experience.

Front OS requests go through Middle OS. Web3 OS verifies chain evidence; Store OS owns order rules; VIXEN Kernel owns shared authorization and money policy. Blockchain payments are not active until a network, asset contract, and provider can be securely verified. See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) and [docs/ARCHITECTURE_IMPLEMENTATION_STATUS.md](docs/ARCHITECTURE_IMPLEMENTATION_STATUS.md).
