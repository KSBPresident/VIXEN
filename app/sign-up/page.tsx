import Image from "next/image";
import Link from "next/link";
import { SocialSignUp } from "@/components/auth/social-sign-up";
import { EmailAccountAccess } from "@/components/auth/email-account-access";

export const metadata = {
  title: "Choose your VIXEN account",
  description: "Create a free member login or apply for a separate creator account.",
};

type SignUpProps = { searchParams: Promise<{ next?: string | string[]; error?: string | string[]; mode?: string | string[]; type?: string | string[] }> };

function getSafeNextPath(value?: string | string[]) {
  const path = Array.isArray(value) ? value[0] : value;
  if (!path || !path.startsWith("/") || path.startsWith("//") || path.startsWith("/\\")) return "/account";
  try {
    const parsed = new URL(path, "https://vixen.invalid");
    return parsed.origin === "https://vixen.invalid" ? `${parsed.pathname}${parsed.search}${parsed.hash}` : "/account";
  } catch {
    return "/account";
  }
}

export default async function SignUpPage({ searchParams }: SignUpProps) {
  const params = await searchParams;
  const nextPath = getSafeNextPath(params.next);
  const callbackFailed = params.error === "oauth";
  const signInFailed = params.error === "signin";
  const initialMode = params.mode === "signin" ? "sign-in" : "create";
  const accountType = params.type === "creator" ? "creator" : "member";
  const nextQuery = Array.isArray(params.next) ? params.next[0] : params.next;
  const accountHref = (type: "member" | "creator") =>
    `/sign-up?type=${type}${nextQuery ? `&next=${encodeURIComponent(nextQuery)}` : ""}`;
  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  );

  return (
    <main className="vixen-signup-page">
      <div className="vixen-signup-wrap">
        <Link className="vixen-signup-brand" href="/" aria-label="Back to VIXEN home">
          <Image src="/assets/vixen-mark-3d.png" alt="VIXEN emblem" width={240} height={240} priority />
        </Link>
        <h1 className="vixen-signup-title">Join VIXEN</h1>
        <p className="vixen-signup-subtitle">Choose the account that matches what you want to do.</p>
        <div className="signup-account-switch" role="group" aria-label="Choose an account type">
          <Link className={`signup-account-option${accountType === "member" ? " is-selected" : ""}`} href={accountHref("member")} aria-current={accountType === "member" ? "page" : undefined}>
            <span className="vixen-kicker">MEMBER · FREE · 18+</span>
            <strong>Watch and subscribe</strong>
            <span>Start with a free login. Follow women creators and choose paid access only when you want it.</span>
          </Link>
          <Link className={`signup-account-option${accountType === "creator" ? " is-selected" : ""}`} href={accountHref("creator")} aria-current={accountType === "creator" ? "page" : undefined}>
            <span className="vixen-kicker">CREATOR · APPLICATION</span>
            <strong>Apply to publish and earn</strong>
            <span>For adult women creators. Creator tools unlock only after review and verification.</span>
          </Link>
        </div>
        {accountType === "member" ? (
          <section className="vixen-auth-card" aria-label="Create a member account">
            {callbackFailed && <p className="vixen-auth-alert" role="alert">We couldn’t complete sign-up. Please try your provider again.</p>}
            <div className="vixen-auth-card-heading">
              <p className="vixen-kicker">FREE MEMBER ACCOUNT</p>
              <h2>Create a free account to watch</h2>
              <p>Member accounts are for adults 18 and over of any gender. Creating an account is free; subscriptions, paid content, messages, and checkout are separate features and are not active yet.</p>
            </div>
            <EmailAccountAccess configured={supabaseConfigured} nextPath={nextPath} accountType="member" initialMode={initialMode} initialError={signInFailed} />
            <div className="vixen-auth-divider"><span>OR USE A CONNECTED ACCOUNT</span></div>
            <SocialSignUp configured={supabaseConfigured} nextPath={nextPath} />
            <p className="vixen-auth-caption">Proton Mail addresses are welcome. Use a separate VIXEN password; Proton OAuth is not connected.</p>
          </section>
        ) : (
          <section className="vixen-auth-card creator-account-preview" aria-label="Create a creator applicant account">
            {callbackFailed && <p className="vixen-auth-alert" role="alert">We couldn’t complete sign-up. Please try again.</p>}
            <div className="vixen-auth-card-heading">
              <p className="vixen-kicker">CREATOR APPLICATION</p>
              <h2>Start your creator application</h2>
              <p>Creator applications are for women aged 18 and over who want to publish adult content, set memberships, and earn from their audience. Use this separate signup path to create your VIXEN login and begin the application process.</p>
            </div>
            <p className="creator-account-status">Your application will be marked pending review. This does not grant publishing, messaging, paid-call, or payout privileges. Those require verified age and identity, consent and safety review, and approval by VIXEN. Do not upload identity documents here; verification is not connected yet.</p>
            <EmailAccountAccess configured={supabaseConfigured} nextPath="/account" accountType="creator" initialMode={initialMode} initialError={signInFailed} />
          </section>
        )}

        <section className="vixen-auth-card" aria-label="Membership and staff access">
          <div className="vixen-auth-card-heading">
            <p className="vixen-kicker">ACCESS LEVELS</p>
            <h2>One member login. Optional membership levels.</h2>
            <p>VIP and VVIP are membership levels attached to a member account, not separate logins. Their purchase, card validation, and event entry are not active until payments and verification are connected.</p>
          </div>
          <div className="vixen-auth-caption">
            <strong>VIXEN staff and creator managers</strong> use invitation-only accounts. There is no public admin or manager signup.
          </div>
        </section>
        <Link className="vixen-signup-back" href="/">← Back to VIXEN</Link>
      </div>
    </main>
  );
}
