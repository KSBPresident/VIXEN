# VIXEN account types

Updated: 2026-10-13

## Public signup choices

### Free member

Anyone aged 18 or older can create a free VIXEN email/password login. A Proton Mail address is supported as an email address; Proton OAuth is not connected. A member can later receive optional membership entitlements. A free login does not itself grant paid content, private messages, paid calls, or event access.

### Creator applicant

Adult women can use the separate creator signup path. Supabase creates a normal authenticated login and a pending application record. The signup type is used only to route the application into review; it does not set `profiles.is_creator`, grant publishing access, or authorize a payout. The application record is private to its owner under RLS. Creator access must be granted through a reviewed, trusted operations process after age and identity checks, consent and safety review, and approved payment operations.

The current public signup records an age affirmation only. That is not identity or age verification. Adult media, creator publishing, paid messaging, payments, payouts, and video calls remain unavailable until their separate server-side boundaries and end-to-end checks are complete.

## Entitlements and staff access

- **VIP and VVIP** are optional membership levels attached to a member login, not separate public signup roles. Payment, active card validation, and event entry are not live.
- **Creator managers and platform administrators** are staff roles. They are invitation-only and must be granted by a trusted, audited process. They are never selected in a public signup form.
- Browser fields and Supabase user metadata are not authorization sources. Persisted, reviewed role records and server-side checks decide access.

## Account creation flow

1. The visitor chooses Member or Creator on `/sign-up`.
2. Email/password signup uses the VIXEN Supabase Auth project and its confirmation redirect to `/auth/callback`.
3. The Auth trigger always creates a default profile. For the creator application path it also creates a pending application row.
4. After email confirmation, `/account` shows the member account and, when present, the private creator application status.
5. Only reviewed server-side privileges can activate creator, manager, or administrator access.

Google, Apple, Microsoft, and Proton OAuth remain unavailable until their Supabase providers have valid credentials and a complete production callback test.
