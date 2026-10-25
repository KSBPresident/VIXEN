# VIXEN seven-layer implementation status

The TOP / EXECUTIVE OS, MIDDLE OS, BACK OS, WEB3 OS, VIXEN STORE OS, VIXEN KERNEL, and FRONT OS names describe internal system responsibilities, not visitor-facing navigation.

## Latest verified status · 2026-10-25 15:27 AST

Main is commit `449dde8776ce6126c6de8047d3a9d7a21bbd44a4`. PR #113 is merged. GitHub CI passed lint, spelling, Kernel tests, TypeScript, production build, and route/link smoke checks. Vercel production deployment `dpl_3193P7315LDduEjXEqEzhS4esZry` is READY for the main commit. The public `vixen-production-package.vercel.app` home, health endpoint, signup paths, creator directory, store, pricing, and crypto payment page returned HTTP 200 without a Vercel sign-in wall. The crypto page was checked for all seven configured routes and matching receive addresses. Vercel reported no runtime errors in the 30-minute window inspected.

Supabase project `srgoxrwhbsxmsrbruktz` has the manual crypto asset/network migration applied. Live tables contain 8 profiles, 2 pending creator applications, 0 approved creators, 0 store products, 0 payment proofs, 0 creator earning entries, and 0 withdrawal requests. These counts do not identify which profiles are real or fake; no account was deleted. Store products can be published only by platform administrators, and the real store catalog is empty.

## Working now

- Member email/password signup and sign-in use VIXEN Supabase Auth. Free member accounts can edit a username and display name, and account access is on the public VIXEN domain.
- Creator signup creates a separate pending application; it never grants creator permissions. Creator identity/age verification is not connected, so no creator may publish adult content, earn, or withdraw yet. Raw ID, selfie, biometric, bank, or tax information must not be collected by VIXEN.
- Approved creators can edit a public profile and upload profile/cover images directly to Supabase Storage, with resumable TUS uploads capped at 45 MiB. A live authenticated upload has not been exercised; there are currently no approved creators.
- The seven owner-supplied wallet routes accept signed-in payment-proof submissions for manual review: USDT on Solana, Tron, BNB Smart Chain, Polygon, and Ethereum; USDC on Solana, BNB Smart Chain, Polygon, and Ethereum; TRX on Tron; BNB on BNB Smart Chain; SOL on Solana; ETH on Ethereum; MATIC on Ethereum. Proofs require a transaction ID and private screenshot. An administrator must independently verify a transfer before approving it. Creator payments/tips are recorded in the same asset/network balance; creators may request manual same-asset/network withdrawals, which the administrator pays and marks with a transfer reference. This proof-to-payout path has not been exercised end to end in production.
- The administrator console includes creator-application, private payment-proof, withdrawal, and store-product review surfaces. One confirmed owner admin account exists; a second email is allowlisted, but no account for it exists yet. A confirmed account is required before that person can access admin tools.
- `/creators` and `/member-preview` use real approved creator rows and show an empty state when none are approved. `/store` shows no placeholder products.

## Still preview-only or unavailable

- Manual wallet proof is not automatic chain verification, checkout, subscription activation, instant access, refund handling, or automatic payout. Do not treat a browser-submitted hash or screenshot as settled funds. VIXEN and NINE coin purchases and discounts paid in those coins are not available.
- Creator feed posts, stories, adult media publishing, paid memberships, paid messages, vMessage delivery/encryption, private video calls, and VIP/VVIP event entry are not live. PR #71, “Add creator feed, stories, and staged onboarding requirements,” remains a draft and is not deployed; its public-media access design requires security redesign before it can be used.
- Store checkout, product/order persistence, inventory, shipping/tax calculation, and fulfillment are not connected. There are no real products to sell.
- No age/identity-verification provider, payout/tax onboarding provider, card processor, crypto checkout provider, chain indexer, or video provider is connected. No VIXEN/NINE token contract exists.
- The vMessage surface is a preview, not Proton-style end-to-end encryption. Private-video screens are previews and do not access camera/microphone or create a video room.
- Password recovery routes are implemented, but live reset-email delivery and a full token-to-password-change cycle have not been verified. No fresh signup and confirmation round trip has been exercised end to end against production.
- Full cross-device visual, accessibility, privacy, moderation, regulatory, and financial-operations checks remain outstanding.

## Current system layers

- **TOP / EXECUTIVE OS** — `lib/executive/platform-readiness.ts` records release evidence. Admin tools cover current manual review actions; complete moderation, finance oversight, incident response, and audit dashboards remain unbuilt.
- **MIDDLE OS** — `lib/application/` contains pricing, audited content-access and private-video join workflow foundations. No live paid-content, messaging, booking, or video orchestration is connected.
- **BACK OS** — Supabase Auth, current application tables, Storage, and RLS are connected. Payment settlement, creator verification, payout/tax onboarding, n8n, email delivery verification, and video adapters are incomplete.
- **WEB3 OS** — Public receive addresses and manual proof/ledger flows are available for the listed routes. No trusted chain scanner, asset-contract verification, confirmation/finality policy, replay prevention, automatic reconciliation, or NINE contract is connected.
- **VIXEN STORE OS** — `lib/store-os/quote.ts` supplies deterministic quote rules. The published catalog is empty; cart persistence, taxes/shipping, checkout, order settlement, and fulfillment are not live.
- **VIXEN KERNEL** — `lib/kernel/` owns roles, access decisions, membership previews, money-split rules, and private-video policy foundations. No purchase or subscription entitlement can be granted by the current wallet-proof flow.
- **FRONT OS** — The responsive Next.js browser app is deployed publicly on Vercel. Feature labels distinguish live account access and manual wallet-proof intake from preview-only products and workflows.

## Dependency rules

1. Front OS calls Middle OS workflows and does not own prices or entitlements.
2. Middle OS coordinates Store OS, WEB3 OS, VIXEN KERNEL, and Back OS interfaces.
3. WEB3 OS verifies settlement through trusted adapters and cannot grant access by itself. Store OS does not trust browser-supplied prices or payment state.
4. TOP / EXECUTIVE OS gates sensitive operations; hiding a control in the UI is not authorization.
5. A capability is marked active only with operational and end-to-end evidence.
6. The browser requests camera and microphone only after an eligible participant explicitly enters a properly authorized session.

## Deferred work

Complete creator verification, post/story access controls, paid checkout, payments and refunds, payout onboarding, real messaging and encryption, private video, moderation, and operational/admin audit surfaces. Keep n8n deferred until the website experience and its APIs are complete. Update this status only after source, database, deployment, and end-to-end evidence agree.
