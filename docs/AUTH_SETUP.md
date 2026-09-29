# Supabase OAuth setup

VIXEN's sign-up page uses Supabase Auth with the Google, Apple, and Azure (Microsoft) providers. OAuth tokens are exchanged server-side through the App Router callback. Provider secrets stay in Supabase Auth settings, not in this repository or browser bundle.

## Application environment

Set these values in local `.env.local` and in Vercel for Preview and Production:

- `NEXT_PUBLIC_SUPABASE_URL`: the Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: the project's publishable key. The client accepts the legacy anon key as a migration fallback.

The public key is intended for browser use; database access must still be protected by authentication, authorization, and RLS policies. Never place a Supabase service-role key in a `NEXT_PUBLIC_*` variable.

## Supabase Auth URLs

In Supabase Dashboard → Authentication → URL Configuration:

- Set the Site URL to the public VIXEN origin.
- Add `http://localhost:3000/auth/callback` to Redirect URLs for local development.
- Add `https://vixen-production-package-caribbeanstarstore.vercel.app/auth/callback` for production.
- Add the exact Vercel preview origins used for OAuth testing, if needed.

Each OAuth provider console must allow the Supabase callback URL shown in that provider's Supabase Auth settings (normally `https://<project-ref>.supabase.co/auth/v1/callback`). That provider callback is different from VIXEN's app callback above.

## Provider credentials

Enable each provider in Supabase Dashboard → Authentication → Sign In / Providers:

- **Google:** create a web OAuth client, set the Supabase callback as an authorized redirect URI, and enter the client ID and secret in Supabase.
- **Apple:** configure the Apple Services ID, team/key details, and signing secret in Supabase. Apple web OAuth signing keys require periodic rotation.
- **Microsoft:** register an app in Microsoft Entra ID, allow the Supabase callback URI, and enter the client ID and secret in Supabase. Restrict supported account types to the intended audience.

Provider sign-up stays visibly unavailable until the Supabase URL and publishable key exist. Even when those are set, a provider also has to be enabled with valid credentials in Supabase before its OAuth flow can succeed.

## Protected account

OAuth returns to `/auth/callback`, exchanges the one-time code for a cookie-backed session, and redirects to `/account`. The account page calls Supabase Auth `getUser()` server-side and redirects unauthenticated requests back to sign-up. The root `proxy.ts` refreshes Supabase session cookies for the protected account route.

## Direct VIXEN accounts and Proton Mail

The email form supports VIXEN-managed registration and sign-in. A Proton Mail address can be used as the email address; the member creates a separate VIXEN password. The app must never request a Proton password. This is email/password authentication, not Proton OAuth or “Sign in with Proton.”

Before activating this flow, provision and verify a VIXEN-specific Supabase Auth project. Do not reuse a Supabase project belonging to another product. Configure its email confirmation and production SMTP, set the VIXEN Site URL and callback redirect above, then add only that project's URL and publishable key to Vercel Preview and Production as `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`. The sign-up form remains disabled while these VIXEN-owned values are absent, and displays that account service is not connected. Never expose a service-role key in the browser.

The registration form uses Supabase `signUp` with an email confirmation redirect to `/auth/callback`. Sign-in uses `signInWithPassword`. The existing callback exchanges the confirmation code for a session and redirects to the validated local `next` path.
