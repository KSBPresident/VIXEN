# VIXEN account types

Updated: 2026-10-13

## Public signup choices

### Free member

Anyone aged 18 or older can create a free VIXEN email/password login. A Proton Mail address is supported as an email address; Proton OAuth is not connected. A member can later receive optional membership entitlements. A free login does not itself grant paid content, private messages, paid calls, or event access.

### Creator applicant

Adult women can use the separate creator signup path. Supabase creates a normal authenticated login and a pending application record. The signup type is used only to route the application into review; it does not set profiles.is_creator, grant publishing access, or authorize a payout. Creator access must be granted through a reviewed, trusted operations process after age and identity checks, consent and safety review, and approved payment operations.

When active, creators are the administrators of their own creator content. They choose whether each post or drop is public or which membership tier unlocks it. The platform enforces that choice; creators cannot change another creator's content or account.

The current public signup records an age affirmation only. That is not identity or age verification. Adult media, creator publishing, paid messaging, payments, payouts, and video calls remain unavailable until their separate server-side boundaries and end-to-end checks are complete.

## Creator pricing and platform commission

Creators set their own prices and describe the access or service included before a member pays. VIXEN plans an 18% platform commission on paid creator transactions. Payment processor fees, taxes, refunds, and chargebacks are separate and may change a creator’s final payout; the 18% figure is not a promise of an 82% net payout. Checkout and payout processing are not active, and the complete fee schedule must be disclosed before monetization opens.

## Entitlements and staff access

- VIP and VVIP are optional membership levels attached to a member login, not separate public signup roles. Payment, active card validation, and event entry are not live.
- Creator managers are staff roles scoped to explicitly managed creators and must be granted by a trusted, audited process. They are never selected in a public signup form.
- Platform owner is the single account admin@vixenvortex.com. The server may resolve it to the platform-admin role only from a confirmed authenticated email that exactly matches the server-only VIXEN_PLATFORM_ADMIN_EMAIL allowlist. It has free, tier-independent access to creator content. The email and role are never accepted from signup fields or browser metadata. Sensitive platform-owner content access is audited and fails closed if the audit write fails.
- Browser fields and Supabase user metadata are not authorization sources. Persisted, reviewed role records and server-side checks decide access.

## Account creation flow

1. The visitor chooses Member or Creator on /sign-up.
2. Email/password signup uses the VIXEN Supabase Auth project and its confirmation redirect to /auth/callback.
3. The Auth trigger always creates a default profile. For the creator application path it also creates a pending application row.
4. After email confirmation, /account shows the member account and, when present, the private creator application status.
5. Only reviewed server-side privileges can activate creator or manager access. The configured, confirmed platform-owner email is resolved on the server to the sole platform-admin role.

Google, Apple, Microsoft, and Proton OAuth remain unavailable until their Supabase providers have valid credentials and a complete production callback test.
