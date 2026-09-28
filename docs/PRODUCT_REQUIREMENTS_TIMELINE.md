# VIXEN requirements in chronological order

This record preserves the requested product and delivery decisions in the order they were given. The latest instruction authorizes a fresh Next.js implementation. Earlier source-preservation instructions are superseded for this rebuild, but existing source material should still be consulted if it becomes accessible.

## 1. Production website and deployment

- Prepare the VIXEN site for production quality, remove deployment-unneeded material, and publish the source to the VIXEN GitHub repository and Vercel project.
- Make the deployment build and launch successfully. Do not claim production readiness until the build and deployed site are verified.
- Keep the website viewable in a preview so the owner can review its appearance.

## 2. Initial business and chatbot capabilities

- Research account-based marketing (ABM) platforms and SDR teams relevant to VIXEN.
- Provide an on-site chatbot that can answer questions about CRM integrations for the site.

## 3. Quality gates, outcomes, and automation

- Align lint, type, test, and production-build gates with the actual deployment pipeline.
- Define a real-world ROI framework with measurable inputs, outputs, attribution, and reporting; do not make unsupported ROI promises.
- Keep user-facing buttons, backend endpoints, automation triggers, and resulting actions/feedback aligned.
- Document the bot/workflow manifest, trigger names, payloads, and expected effects.

## 4. n8n webhook behavior

- Website webhook events must map to the correct n8n workflow and trigger.
- Verify each button/action → API endpoint → webhook/workflow mapping and its expected response.

## 5. VIXEN 1.0 architecture and product scope

- Use a Next.js App Router and TypeScript architecture with public routes, protected user routes, admin routes, API routes, shared components, business logic, Supabase schema/migrations, tests, and product/security/database documentation.
- The requested product areas include discovery, events, creators, viewing, store, checkout, profiles, rewards, launch, dashboard, wallet, subscriptions, purchases, messages, notifications, security, and admin functions.

## 6. Product benchmark and creator placement

- Use OnlyFans as a product-experience benchmark for creator profiles, discovery, subscriptions, messaging, purchases, and monetization while retaining VIXEN branding and product identity.
- Place rapper/creator profiles in intended discovery/listing routes and ensure each profile opens its matching creator page.

## 7. Code-level integrations, AI, CI/CD, and recovery

- Implement integrations in application and backend code, not as disconnected buttons or documentation-only references.
- Implement LLM/AI functionality in the code, including the CRM chatbot. Keep provider credentials server-side and provide safe unavailable-service behavior.
- Configure CI on pushes and pull requests with lint, type, test, and build checks; use Vercel preview deployments for review and production deployments only from the approved branch after checks pass.
- Any automated file committer must work on an isolated branch and produce reviewable changes. Do not commit generated changes straight to production/main without protections and successful checks.
- Use a finite error-recovery loop: capture failing output, make a focused correction, rerun relevant checks, and stop for secrets, service outages, migrations, security-sensitive changes, ambiguous requirements, or repeated failure. No infinite retries.

## 8. Visual direction

- Use the supplied VIXEN flyer as the visual reference: black background, neon pink and silver accents, strong VIXEN wordmark, creator-first messaging, tiered access, paid messages, exclusive drops, creator control, and a clear “Join the Elite” action.

## 9. Current build priority

- Start a clean Next.js application in this repository, establish a working public website and preview first, then add and verify backend services and platform features in the sequence above.
- Do not present payments, authentication, wallet operations, AI answers, or n8n actions as functional until each is integrated and verified against its real service.
