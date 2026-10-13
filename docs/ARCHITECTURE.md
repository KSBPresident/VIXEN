# VIXEN 1.0 Architecture

This document defines the internal system boundaries for the VIXEN web app. The seven OS layers are implementation responsibilities, not visitor-facing navigation.

## System layers

### TOP / EXECUTIVE OS
Owns platform policy, governance, operational controls, release approvals, moderation and finance oversight, audit review, and incident or rollback decisions. It cannot bypass lower-layer authorization or audit requirements.

### MIDDLE OS
Owns cross-product workflows and orchestration: onboarding, creator publishing, discovery, memberships, messages, purchases, wallets, rewards, notifications, and support. It receives Front OS requests, calls Web3 OS, VIXEN Store OS, and VIXEN Kernel capabilities, and coordinates Back OS adapters.

### BACK OS
Owns infrastructure and external-service adapters: Supabase, approved payment providers, storage, email, LLMs, CRM, n8n, observability, scheduled jobs, and chain RPC/indexing providers. Secrets stay server-side. Adapters validate inputs, normalize errors, and never decide entitlements independently.

### WEB3 OS
Owns chain-specific wallet proof and settlement workflows: challenge-based wallet ownership checks, chain/asset configuration, transaction verification, confirmation/finality policy, replay protection, and reconciliation evidence. It delegates signing, RPC, and indexing integrations to Back OS adapters; Store OS supplies the expected order, recipient, asset, and amount; VIXEN Kernel applies account and entitlement policy. The browser never proves a payment from a displayed balance or unverified transaction hash. VIXEN does not custody seed phrases or private wallet keys. This boundary is planned; no chain, wallet, NINE asset contract, or settlement provider is active.

### VIXEN STORE OS
Owns storefront catalog and availability, cart composition, store offers, quote generation, order state transitions, and fulfillment workflow contracts. It uses integer minor units and delegates shared identity, authorization, entitlement, and money invariants to VIXEN Kernel. Payment and fulfillment providers remain in Back OS. Browser-supplied prices, payment status, and order state are never authoritative.

### VIXEN KERNEL
Owns stable platform rules: identities and roles, creator/member relationships, entitlements, package limits, shared money and discount invariants, ledger contracts, purchase/subscription transitions, rewards eligibility, content access, consent boundaries, and audit events. Core rules are deterministic and tested without network access.

### FRONT OS
Owns the user-facing Next.js pages, layouts, components, interaction states, accessibility, and presentation. It presents member, creator, store, and authorized admin experiences. It calls Middle OS workflows through typed server actions or API boundaries. Browser state never authorizes roles, money, or entitlements.

## Dependency direction

```text
TOP / EXECUTIVE OS
          |
       MIDDLE OS
    /     |     |      \
 BACK   WEB3   STORE   KERNEL
    \     |     |      /
        FRONT OS
```

The diagram shows responsibility, not permission for direct coupling. Front OS requests enter Middle OS. Middle OS coordinates domain capabilities and external effects. Web3 OS verifies chain evidence, Store OS applies order rules, and Kernel owns shared policy. Back OS adapters cannot grant privileges or independently confirm financial effects.

## Repository mapping

- `app/`, `components/`, and `public/`: FRONT OS.
- `app/api/`: transport boundary for MIDDLE OS workflows, webhooks, and health endpoints.
- `lib/application/`: MIDDLE OS use cases and orchestration.
- `lib/adapters/`: BACK OS integrations for Supabase, approved payments, chain RPC/indexing, n8n, LLMs, CRM, mail, storage, fulfillment, and observability.
- `lib/web3-os/`: WEB3 OS wallet-proof and chain-settlement contracts/workflows.
- `lib/store-os/`: VIXEN STORE OS commerce rules and workflows.
- `lib/kernel/`: VIXEN KERNEL types, policies, access decisions, money rules, ledgers, rewards, and state transitions.
- `lib/executive/` and audited admin workflows: TOP / EXECUTIVE OS.
- `supabase/migrations`: persisted state and database policies that must agree with Kernel contracts.
- `docs/`: architecture, contracts, threat model, operational runbooks, and release evidence.

## Production invariants

1. Validate every user- or service-supplied input at its boundary.
2. Verify server-side identity before authorization; UI visibility is never access control.
3. Represent money in integer minor units and record financial effects through an auditable, idempotent ledger.
4. Verify payment webhook signatures and make event effects idempotent. A selected provider must explicitly approve VIXEN adult content, adult live video, storefront, company, and target markets before integration.
5. Verify blockchain settlement against server-configured network, asset, recipient, amount, unique reference, and required finality; prevent replay and reconcile independently.
6. Never collect or custody member seed phrases or private wallet keys.
7. Enable Supabase RLS for user-owned data and use service-role credentials only on trusted servers.
8. Give n8n and LLM calls server-side credentials, bounded retries, timeouts, and safe error states.
9. Record sensitive administrative actions in a durable audit trail.
10. Advertise no capability as active until its configuration and end-to-end verification succeeds.
11. CI gates lint, type checking, tests, and production build; production changes follow review and rollback procedures.
