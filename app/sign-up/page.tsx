import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { SocialSignUp } from "@/components/auth/social-sign-up";
import { EmailAccountAccess } from "@/components/auth/email-account-access";
import { CreatorApplicationForm } from "@/components/auth/creator-application-form";
import { createClient } from "@/lib/supabase/server";
import "./signup.css";

export const metadata = {
  title: "Choose your VIXEN account",
  description: "Create a free member login or apply for a separate creator account.",
};

type SignUpProps = { searchParams: Promise<{ next?: string | string[]; error?: string | string[]; mode?: string | string[]; type?: string | string[] }> };

function getSafeNextPath(value?: string | string[]) {
  const path = Array.isArray(value) ? value[0] : value;
  if (!path || !path.startsWith("/") || path.startsWith("//") || path.startsWith("/\\\\") || path === "/sign-up" || path.startsWith("/sign-up?")) return "/account";
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

  // A stale "Create account" link should never send an authenticated user
  // back through signup. Recover their session and return them to their
  // account (or the validated destination requested by the sign-in flow).
  if (supabaseConfigured) {
    let isSignedIn = false;
    try {
      const supabase = await createClient();
      const { data: { user }, error } = await supabase.auth.getUser();
      isSignedIn = Boolean(user && !error);
    } catch {
      isSignedIn = false;
    }
    if (isSignedIn) redirect(nextPath);
  }

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
          <section className="vixen-auth-card creator-account-preview" aria-label="Submit a creator application">
            {callbackFailed && <p className="vixen-auth-alert" role="alert">We couldn’t complete sign-up. Please try again.</p>}
            <div className="vixen-auth-card-heading">
              <p className="vixen-kicker">CREATOR APPLICATION · PRIVATE REVIEW</p>
              <h2>Apply before creating your account.</h2>
              <p>Creator applicants submit their details for administrator review first. If approved, you’ll receive a one-time account setup link at your email. No VIXEN login is created while your application is waiting.</p>
            </div>
            <div className="creator-account-status">
              <strong>Review includes age and identity checks.</strong> An administrator must verify eligibility and identity through VIXEN’s approved review process before approving an application. Do not send identity documents by email or chat.
            </div>
            <CreatorApplicationForm configured={supabaseConfigured} />
            <p className="vixen-auth-caption">After approval, email confirmation activates your creator login. Publishing and earnings unlock only after admin approval and account confirmation. Paid memberships, paid messages, and private video remain separate features.</p>
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
