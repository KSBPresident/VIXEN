# Production Readiness Audit

## Crypto payment readiness addendum · 2026-10-23

- The requested future offer is 10% off eligible creator subscriptions paid with NINE Coin. NINE Coin is still in development and is not accepted; other supported cryptocurrencies carry no discount. The app has manually reviewed direct-wallet routes for USDT on Solana, Tron, BNB Smart Chain, Polygon, and Ethereum; USDC on Solana, BNB Smart Chain, Polygon, and Ethereum; and TRX on Tron. Signed-in users can submit a transaction ID and a private screenshot for review. This is a manual proof-and-review flow, not automatic checkout or settlement: no transaction monitor, automatic payment match, purchase unlock, or automatic payout is live. The member submission and administrator review path is implemented, but it has not been exercised end to end in production.
- NOWPayments is a candidate to evaluate because it publishes an adult-platform offering and documents invoice creation plus signed IPN callbacks. This is not proof that VIXEN has been accepted as a merchant. Obtain written approval for VIXEN's exact company, adult creator content, live-video offering, store catalog, and settlement countries before selecting or enabling it. Its API and IPN secret must remain server-only; fulfill an order only from a verified, idempotent server callback, never from a browser return page.
- Trinidad and Tobago's securities regulator states that the Virtual Assets and Virtual Asset Service Providers Act, 2025 took effect on December 23, 2025, with virtual-asset activities conducted as a business temporarily prohibited through December 31, 2026 unless authorized under its regulatory sandbox. The public notice also distinguishes personal purchases of goods and services from business activity. Get a written local legal/regulatory determination on whether VIXEN's merchant checkout and processor flow fall within the Act and what authorization applies before taking crypto payments in or from Trinidad and Tobago. This readiness note is not a legal conclusion.
- Coinbase Commerce is unsuitable without a policy exception: its current prohibited-business policy includes adult content, pay-per-view, and adult live-chat services.
- Until provider acceptance and legal clearance are documented, keep every crypto payment method labelled planned and checkout disabled. Do not request or put API keys, IPN secrets, wallet seed phrases, or private keys in chat or source control.


Audit date: 2026-10-23 (America/Port_of_Spain)  
Repository: `KSBPresident/VIXEN`, branch `main`  
Production deployment: Vercel project `vixen-production-package`  
Latest inspected main commit: `b1de11bc35756be34cc5448f571a469b4e30b934`

## Current verification · 2026-10-23 19:44 AST

- Repository main is at `b1de11bc35756be34cc5448f571a469b4e30b934`. Admin-only store publishing is merged. PR #100 reconciled the store migration filename with the version already recorded in Supabase.
- Supabase project `srgoxrwhbsxmsrbruktz` is ACTIVE_HEALTHY. The `public.store_products` catalog has RLS enabled and zero rows. Anonymous and signed-in users can read published rows only; the all-commands policy requires both the trusted `vixen_admin` Auth app-metadata flag and the configured owner email. The confirmed configured owner account has that flag.
- The applied store migration is recorded remotely as version `20261023233001`, matching `supabase/migrations/20261023233001_admin_only_store_products.sql` on main.
- The latest main commit has a failed Vercel status with a `build-rate-limit` target and a failed deployment status. The connected Vercel API returns 403 for team scope `caribbeanstarstore`; the latest main commit is not verified as deployed, and the READY deployment documented below is historical.
- The public store was verified empty at 19:33 AST on 2026-10-23; the administrator-only catalog exists, but no live checkout or fulfillment is connected.
- Supabase security advisors currently report five authenticated-callable `SECURITY DEFINER` functions and leaked-password protection disabled. Review these before launch. Performance advisors report eight unindexed foreign keys and twelve unused indexes; assess before adding significant production traffic.
- Signup, creator verification, creator content publishing, subscriptions, paid messaging, private video, automated crypto settlement, and creator payouts are not verified as production-ready end to end. Keep their UI states honest and do not claim they are live based on previews or schema alone.

Audit timestamp: 2026-10-23 19:44 AST (23:44 UTC)

## Historical verification snapshot · 2026-10-23 (superseded by current state below)

- PR #73 (“Make creator profile uploads resumable”) is merged to `main`. PR #82 (“Document planned USDT and USDC checkout scope”) is also merged to `main` at `0cb98998ec648520b11bba2132728009788cbe35`; its CI passed lint, spelling, kernel tests, typecheck, production build, and route/link smoke checks. GitHub reports the Vercel status check succeeded for this commit, but a direct fetch of public pricing/store routes was unavailable during this audit.
- GitHub Actions run #193 passed lint, spelling, Kernel policy tests, TypeScript, production build, and route/link smoke checks for the creator feed/story implementation in PR #71. GitHub Actions run ID 39196653064 for PR #73 passed lint, spelling, Kernel policy tests, TypeScript, production build, and route/link smoke checks.
- Vercel production deployment `dpl_65x1GssVUqzjMKHG7QCeTBFDGeYi` for the merged main commit is READY and owns the public aliases `https://vixen-production-package.vercel.app`, `https://vixen-production-package-caribbeanstarstore.vercel.app`, and `https://vixen-production-package-git-main-caribbeanstarstore.vercel.app`. A fetch of the production creator signup route returned HTTP 200.
- The public creator signup page displays all three planned stages: account/profile, age and identity verification, and payout/tax setup. This is disclosure of requirements, not a connected identity-proofing or payout flow. Raw identity, biometric, bank, or tax data must not be submitted until vetted providers and their privacy/security controls are selected.
- The approved-creator profile editor and direct Supabase Storage TUS upload path are in main and deployed. Uploads are capped at 45 MiB with progress, retries, and browser-session resume support. CI/build and deployment passed; an authenticated approved-creator file upload has not been exercised end to end, so successful real-media transfer is not yet verified.
- Supabase project `srgoxrwhbsxmsrbruktz` (VIXEN) is ACTIVE_HEALTHY. The connected public schema has RLS on profiles, creator applications, subscriptions, conversations, messages, message media, blocks, and reports. The production migration list includes chat migrations that are not present in the repository migration directory; reconcile this source/remote drift before future schema changes.
- The profile media migration (`20261018192111`) is applied. The feed/story migration in PR #71 is not applied and its tables are absent from the production schema. Its current public-feed access design needs a reviewed age/access gate for adult media before release.
- Supabase security advisors report four authenticated-callable `SECURITY DEFINER` chat functions and leaked-password protection disabled. The functions inspected check the caller and scope updates to the caller's conversation; these warnings still require an explicit grants/policy review and Auth setting change.
- Public routes are reachable without a Vercel login. Auth signup/session behavior is in the product, but a fresh signup-confirmation and authenticated recovery round trip have not been verified in production.
- Creator profile editing is deployed. Creator post/story publishing, paid content, memberships, messaging delivery, checkout, payouts, private video, and events are not production capabilities unless separately listed as verified below; visual previews are not live integrations.

## Verified

- GitHub Actions passed lint, kernel policy tests, TypeScript, and `next build` for PRs #31, #33, #34, #36, #37, and PR #38 (session booking walkthrough) and PR #39 (local message draft preview) and PR #40 run 106 (membership checkout preview and NINE cent-rounding rules). PR #40 passed lint, Kernel tests, TypeScript, and production build.
- GitHub Actions defines a `main` push and pull request quality job with ESLint, TypeScript, kernel tests, and `next build`.
- The repository has a public landing page, an About page with the Nine Tail Fox asset, creator discovery, illustrative membership pricing, a health endpoint, member feed and message previews, including a local draft-only composer, plus the private-video preview, a creator workspace preview at `/creator/studio`, and a private-events preview at `/events`. Search controls route to sample creator results. The private video page includes a two-step, interactive booking/checkout walkthrough. The events page explains VIP/VVIP 21+ eligibility, required active card, creator opt-in, consent limits, and that no events or requests are active.
- Sample profiles, example prices, private-session controls, and membership checkout calculations are labelled as preview/illustrative content in their public surfaces. The NINE example is restricted to creator subscriptions and rounds to cents; no payment can be initiated.
- The private-video kernel policy and Middle OS join workflow fail closed on identity, payment, creator acceptance, booking, audit, and short-lived credential checks. No provider or payment adapter is connected.

## Not yet production-ready

The earlier production checks in this section are historical. Current deployment status and release blockers are recorded under Current verification above.

The repository still lacks live implementation and verification for:

- Supabase email/password authentication and protected account access are configured. The free member signup is live; the creator signup now creates a pending application and does not grant creator privileges. The connected VIXEN database has RLS on its current tables. Still incomplete: reviewed creator/admin/manager role assignment, production verification of signup confirmation and password recovery emails, adult identity checks, and the wider Supabase application-data layer. n8n remains deferred.
- Creator content publishing, story management, memberships, and server-side package ownership or entitlement enforcement. The approved-creator public-profile editor is deployed, but profile media upload still needs authenticated end-to-end verification. `/creator/studio` remains a preview for all other creator tools.
- Automated checkout/webhooks, chain monitoring and idempotent settlement, refunds, and production end-to-end payment verification remain incomplete. Current Supabase schema inspection confirms the configured private payment-proof bucket, member-owned proof submission policies, administrator review policies, creator earnings ledger, and creator-balance view with `security_invoker=true` so underlying RLS still scopes rows. Source includes authenticated screenshot/transaction-ID submission, an admin proof-review page/action, approval-triggered ledger credit using the launch-week 5% or standard 15% commission, creator balance/withdrawal screens, and admin withdrawal processing. These are implemented components, but the signed-in proof-to-admin-review-to-creator-balance flow has not been run end to end against the public deployment; a creator requests withdrawal and the administrator pays manually. Store checkout and fulfillment remain inactive. The Endcash QR/link is only a candidate for eligible VIXEN store and token purchases; it does not verify or reconcile payments, and the repository has no verified Endcash checkout/webhook integration. The Endcash QR/link is only a candidate for eligible VIXEN store and token purchases; it does not verify or reconcile payments, and the repository has no verified Endcash checkout/webhook integration. Endcash's published terms restrict certain sexually oriented materials/services and content, so obtain written merchant confirmation for the exact catalog and token model before use. WiPay's published card terms restrict prohibited adult content, private members' clubs, and virtual currency exchanges or other stores of value; obtain written approval for VIXEN's exact products and token model before use. Neither provider is active in the app. PayPal is excluded for VIXEN adult digital-content, subscription, and webcam/video-call transactions under its current policy. VIXEN must first obtain explicit written approval from any processor/acquirer for its adult content, adult live-video services, storefront, company, and target markets; Stripe's current rules prohibit adult content and adult live-chat services.
- Private video provider implementation, booking persistence, signaling, browser camera/microphone consent flow, and iPhone/Android/Windows device verification.
- Wallet, purchases, real message delivery and notifications, rewards, journey rules, moderation, or audited administration. The message composer is only a client-side preview.
- LLM/CRM/ABM assistance or end-to-end workflow checks.
- n8n automation manifest and trigger mapping. This remains deferred until the website experience is complete.
- Cross-device visual checks and a full keyboard, contrast, and screen-reader review remain outstanding. Only desktop browser route and interaction checks have been recorded; a successful CI/deployment does not prove that all device layouts or assistive-technology paths are ready.

Account signup and profile access are implemented; do not describe identity verification, creator publishing beyond profile edits, CRM, AI, n8n automation, payment, paid content, or video as live until each capability is implemented, configured, and verified.

## Website-first release gates

Before wiring deferred back-end services, finish and verify the browser-based product surfaces: clear member and creator entry points, discoverable sample-to-live boundaries, pricing and privilege explanations, member browsing, creator profile, store, messaging and private-video booking/join user flows, responsive layouts, accessibility, and error/recovery states. Keep unavailable actions visibly disabled or labelled as previews. When this gate passes, notify the owner that it is time to connect the specific Supabase and n8n accounts they choose; do not request or connect them earlier.

## Full production release gates

After the website-first experience is complete, production readiness also requires:

1. Complete each system boundary described in `ARCHITECTURE.md` with explicit ownership and typed contracts.
2. Connect account, booking, payment, and protected content storage with row-level security and migrations.
3. Test authorization and financial rules at the server/API boundary.
4. After the website-first milestone and the user's approval, connect only a processor that has explicitly accepted the adult business model and target markets. Verify signed/idempotent events and safe failure paths. Defer Supabase and n8n until the website experience is complete.
5. Run lint, type check, automated tests, and production build successfully in CI.
6. Confirm required environment variables are set without exposing secrets.
7. Confirm public routes are publicly reachable and protected routes remain protected.
8. Review the production deployment, verify critical flows on supported devices, and document rollback steps before release.
