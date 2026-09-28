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
