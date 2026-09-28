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
