# VIXEN seven-layer implementation status

The TOP / EXECUTIVE OS, MIDDLE OS, BACK OS, WEB3 OS, VIXEN STORE OS, VIXEN KERNEL, and FRONT OS names describe internal responsibilities, not visitor-facing navigation.

## Latest verified status · 2026-10-29

Main is commit `f269f6934ff885863d1b5289bf5fe2ee2c503cbc`. PR #116 (reviewed creator onboarding and feed posting) and PR #117 (public login aliases) are merged. Their CI checks passed. Vercel production deployment `dpl_JC5K3FjRUeqJK3bF7FuseFXRdE67` is READY and aliases `vixen-production-package.vercel.app`.

Production checks:
- `/sign-up?type=member` and `/sign-up?type=creator` return HTTP 200; the creator path displays the pre-account application flow.
- `/login` and `/sign-in` both reach the existing member email/password form in sign-in mode.
- An unauthenticated request to `/creator/posts` is redirected to sign-up.
- The authenticated creator posting flow was not tested with a real approved creator account.

Supabase project `srgoxrwhbsxmsrbruktz` has migration `creator_approval_and_feed` applied. `creator_preapplications` and `creator_posts` exist; the `creator-feed-media` storage bucket has a 47,185,920-byte limit (45 MiB). At verification, both tables were empty. No real creator application or post has been submitted, and no real creator upload has been exercised.

## Working and configured

- Member email/password signup and sign-in are available through VIXEN Auth. The public signup page returns successfully. A fresh production signup, confirmation email, sign-in, and account-return round trip has not been exercised.
- Creator registration is a pre-account application. An admin must review it before an account is created. An approved applicant receives a single-use link bound to the approved email; the link expires after seven days and account activation requires email confirmation.
- Admins can approve or reject pre-account applications. Approval requires the admin form's identity-review confirmation. VIXEN does not collect ID, selfie, biometric, bank, or tax documents. No identity-verification provider is connected, so the review attestation is not independent evidence from an integrated provider.
- After an approved creator activates the account, the app provides a public profile feed composer for text, images, and videos. Media uploads go directly to Supabase Storage, capped at 45 MiB. Posts are explicitly public. This flow is configured but not end-to-end verified with an approved creator.
- Creator feed media is public by design for the public-feed feature. Do not upload private or paid content to this feed. Private media and paid access controls are not active.
- `/creators` and member discovery rely on approved records and can be empty. The public store catalog has no real products; only admins may manage store listings.
- The admin console has review surfaces for creator applications, payment proofs, withdrawals, and store products. Admin access is controlled server-side and by database policies.

## Manual payment and money-flow limits

- The app accepts signed-in submissions of payment proof for configured wallet/network combinations and routes them to an admin review queue. A submitted screenshot or transaction hash is not proof of settlement until independently verified on the correct network.
- Creator tips/earnings and withdrawal requests have database workflows, but a real purchase-to-creator-ledger-to-withdrawal sequence has not been exercised end to end in production. Admin settlement is manual.
- Wallet proof intake is not hosted checkout, automatic chain verification, subscription activation, automatic access, refund handling, or automatic payout.
- VIXEN Coin and NINE Coin purchases, balances, and coin discounts are not available. Do not label them as active.

## Still preview-only or unavailable

- No age/identity-verification provider or payout/tax onboarding provider is connected. Adult publishing and monetization must remain unavailable until creator eligibility can be securely verified and the required operational process is in place.
- Stories are not implemented in production. Creator feed posts are not 24-hour stories.
- Paid creator memberships, paid messages, vMessage delivery/end-to-end encryption, private video calls, VIP/VVIP event entry, and subscription checkout are not active.
- Store checkout, orders, inventory, taxes, shipping, returns, and fulfillment are not connected; no real store listings are available.
- No card processor, approved crypto checkout provider, chain indexer, trusted settlement verification, or VIXEN/NINE token contract is connected.
- Password reset delivery and a complete token-to-password-change cycle have not been verified.
- Full cross-device visual, accessibility, privacy, moderation, regulatory, and financial-operations checks remain outstanding.

## System layers

- **TOP / EXECUTIVE OS** — Admin review surfaces exist. Complete moderation, finance oversight, incident response, and audit dashboards remain outstanding.
- **MIDDLE OS** — Account application and creator-feed workflows exist. Paid-content, messaging, booking, and video orchestration remain unavailable.
- **BACK OS** — Supabase Auth, database, RLS, and Storage are connected. Identity, payout/tax, email-delivery verification, merchant settlement, n8n, and video adapters are incomplete.
- **WEB3 OS** — Manual wallet-proof intake exists. Trusted chain/asset verification, finality, replay prevention, automatic reconciliation, and NINE settlement are unavailable.
- **VIXEN STORE OS** — Store catalog controls exist but no real items or checkout/order fulfillment are active.
- **VIXEN KERNEL** — Roles and access decisions are enforced in application and database policies. Paid entitlements are not granted by proof submission.
- **FRONT OS** — Responsive browser web app is deployed publicly. Login aliases route to the sign-in form; preview-only workflows are distinguished from available account paths.

## Security notes

The latest Supabase security advisor reported eight authenticated SECURITY DEFINER RPC warnings, including guarded creator-review and invitation functions. These functions enforce authorization inside their bodies; the warnings still need a human security review. The complete advisor report also includes older project findings. Do not describe the security review as complete.

## Dependency rules

1. Front OS calls Middle OS workflows and does not own prices or entitlements.
2. Middle OS coordinates Store OS, WEB3 OS, VIXEN KERNEL, and Back OS interfaces.
3. WEB3 OS verifies settlement through trusted adapters; Store OS does not trust browser-supplied prices or payment state.
4. TOP / EXECUTIVE OS gates sensitive operations; hiding a control in the UI is not authorization.
5. Mark a capability active only with operational and end-to-end evidence.
6. The browser requests camera and microphone only after an eligible participant explicitly enters an authorized session.

Keep n8n deferred until the core web app and its APIs are complete. Update this status only when source, database, deployment, and end-to-end evidence agree.
