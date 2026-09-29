# VIXEN canonical implementation sequence

This is the authoritative order for building VIXEN 1.0. Every accepted requirement discussed for the project belongs in this sequence; this is not a conversation log. The current direction is a fresh Next.js implementation in the empty VIXEN repository. Do not claim a feature is live until its implementation and checks pass.

## 1. Application and delivery foundation

- Establish the Next.js App Router, TypeScript, design tokens, responsive layout, accessibility baseline, metadata, and health endpoint.
- Keep production quality gates aligned: ESLint, TypeScript, relevant automated tests, and the production build.
- Run CI on pull requests and pushes to the production branch. Use Vercel preview deployments for review and production delivery only from the approved branch after required checks pass.
- Any automated file committer must write to an isolated branch and create a reviewable pull request; never write generated changes directly to production/main.
- Use a finite error-recovery loop: capture diagnostics, make one focused correction, rerun relevant gates, and stop after a small retry limit or on credentials, service outage, migration, security-sensitive changes, or unclear requirements. Do not loop indefinitely.

## 2. Brand and public website

- Implement the supplied flyer direction: black background, neon pink and silver accents, VIXEN wordmark, creator-first positioning, tiered access, paid messages, exclusive drops, creator control, and a clear “Join the Elite” action.
- Use OnlyFans as a product-experience benchmark for creator profiles, discovery, subscriptions, messaging, purchases, and monetization. Keep VIXEN's own brand and product identity.
- Make the public landing page responsive and accessible, with clear navigation and working links.

## 3. Creator discovery and profiles

- Build discover/creators listings and creator profile routes.
- Place rapper/creator profiles in intended listings and routes; each card and profile link must open the matching creator page.
- Treat any sample creators as clearly labeled preview content until real, authorized creator records are connected.

## 4. Identity and protected member experiences

- Add authentication and authorization before protected dashboard, profile, wallet, subscription, purchase, message, notification, reward, and security routes.
- Offer VIXEN-managed email/password registration and sign-in; accept Proton email addresses as login addresses while users create a separate VIXEN password. Never ask for or collect Proton account credentials. Add Proton OAuth only if Proton exposes and enables a standards-compatible identity-provider flow.
- Separate a no-cost member account from paid creator memberships: free accounts browse public creator profiles and previews only, and do not inherit creator, payout, management, or paid-content privileges.
- Publish a clear entitlement matrix for each membership tier. A membership applies to one creator; exact included content, exclusions, renewal, cancellation, and refund terms must be disclosed before checkout.
- Jo-Lene Kennedy is the Head Girl / Creator Manager responsible for managing all creator profiles. Link this role only to her verified account, enforce it server-side, and audit management actions; it does not grant platform-wide finance or administrator privileges by default.
- Enforce authorization on server/API routes as well as in the interface.
- Use Supabase schema, migrations, and policies as the source of truth when configuring data and access.

## 5. Creator studio and content operations

- Add creator/studio workflows for managing profiles, content, tiers, exclusive drops, and paid-message offerings.
- Provide the verified Head Girl / Creator Manager role with roster-wide creator-management privileges and the least access needed to perform that work.
- Align every visible button with a real route or API operation and an honest success/error state; do not leave dead controls.

## 6. Checkout, subscriptions, purchases, and wallet

- Add an 18+ intimate wellness storefront for adult products, lingerie, personal care, and accessories. Provide clear categories, searchable catalog cards, material/product details, and a usable shopping-bag preview.
- Mark sample listings and prices as illustrative, and keep order placement, payment, shipping, and returns inactive until their policies and commerce integrations are ready. Do not claim inventory or delivery availability before it is verified.
- Plan a NINE Coin benefit: 50% off any VIXEN creator subscription paid with NINE. Keep it clearly marked as upcoming and nonredeemable until the NINE website/token, supported networks, purchase sources, payment verification, and end-to-end checkout are confirmed. The NINE site is in development; do not imply NINE payments or exchange availability are live. The benefit applies to creator subscriptions only, not store purchases, unless scope is explicitly expanded later.\n- Integrate Stripe server-side for checkout and subscription operations, with signature-verified webhook handling, idempotency, and explicit error recovery.
- Use the database ledger and tested money rules for balances and purchases; do not treat client-side values as authoritative.
- Do not expose secret keys or mark commerce live until test-mode and production configuration are verified.

## 7. Rewards and journey

- Implement journey and rewards behavior against the existing business rules and database model.
- Keep journey, money, and rewards behavior covered by relevant tests before enabling rewards or financial effects.

## 8. Administration, moderation, and security

- Add role-protected admin routes for dashboard, users, creators, finance, moderation, rewards, and security.
- Add auditability for sensitive actions and validate access controls, input handling, privacy, and data retention.

## 9. LLM/AI and CRM assistance

- Implement LLM/AI functionality in application code, including an on-site chatbot that answers CRM-integration questions.
- Keep provider credentials server-side, make the provider/model configurable, rate-limit and validate requests, and return safe unavailable-service states.
- Research relevant ABM platforms and SDR team workflows; ground recommendations in verifiable sources and do not claim a CRM integration exists unless it is connected and verified.

## 10. n8n and website automation

- Define a workflow manifest with trigger names, endpoint, payload schema, authentication, expected effects, and response/error handling.
- Map every related website button/action to the backend route and corresponding n8n webhook/workflow trigger.
- Verify the full path from UI action through API to n8n and back. Never put webhook secrets in browser code.

## 11. ROI and product measurement

- Define a real-world ROI framework with measurable inputs, outcomes, costs, attribution windows, and reporting.
- Track conversion, retention, creator earnings, payout timing, support load, and platform costs only where data collection is disclosed and appropriately protected.
- Do not publish unsupported ROI promises.

## 12. Production release and review

- Confirm all configured integrations, required environment-variable names, database migrations, security controls, and rollback steps.
- Verify CI passes and the Vercel preview renders all implemented flows before promoting the approved commit to production.
- Give the owner a working preview and distinguish live capabilities from preview/sample content.

## Current first milestone

A clean, accessible, responsive public VIXEN website in Next.js with the supplied visual direction, creator discovery/profile routes, a truthful preview state, CI checks, and a Vercel preview. Then continue through the canonical phases above.