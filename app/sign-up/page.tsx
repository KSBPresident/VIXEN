import Image from "next/image";
import Link from "next/link";
import { SocialSignUp } from "@/components/auth/social-sign-up";
import { EmailAccountAccess } from "@/components/auth/email-account-access";

export const metadata = { title: "Choose your VIXEN account", description: "Choose a member account to watch women creators or a separate creator account path." };

type SignUpProps = { searchParams: Promise<{ next?: string | string[]; error?: string | string[]; type?: string | string[] }> };

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
            <span className="vixen-kicker">MEMBER · 18+</span>
            <strong>Watch and subscribe</strong>
            <span>Follow women creators and choose memberships or paid content.</span>
          </Link>
          <Link className={`signup-account-option${accountType === "creator" ? " is-selected" : ""}`} href={accountHref("creator")} aria-current={accountType === "creator" ? "page" : undefined}>
            <span className="vixen-kicker">CREATOR · WOMEN 18+</span>
            <strong>Publish and earn</strong>
            <span>Create adult content and build a paid community.</span>
          </Link>
        </div>
        {accountType === "member" ? (
          <section className="vixen-auth-card" aria-label="Create a member account">
            {callbackFailed && <p className="vixen-auth-alert" role="alert">We couldn’t complete sign-up. Please try your provider again.</p>}
            <div className="vixen-auth-card-heading">
              <p className="vixen-kicker">MEMBER ACCOUNT</p>
              <h2>Create a free account to watch</h2>
              <p>Member accounts are for adults 18 and over of any gender. Adult-content access, memberships, and checkout are not active yet.</p>
            </div>
            <EmailAccountAccess configured={supabaseConfigured} nextPath={nextPath} />
            <div className="vixen-auth-divider"><span>OR USE A CONNECTED ACCOUNT</span></div>
            <SocialSignUp configured={supabaseConfigured} nextPath={nextPath} />
            <p className="vixen-auth-caption">Proton Mail addresses are welcome. Use a separate VIXEN password; Proton sign-in is not connected.</p>
          </section>
        ) : (
          <section className="vixen-auth-card creator-account-preview" aria-label="Creator account information">
            <div className="vixen-auth-card-heading">
              <p className="vixen-kicker">CREATOR ACCOUNT PREVIEW</p>
              <h2>For adult women creators</h2>
              <p>Creator accounts are separate from member accounts. They are intended for women aged 18 and over who want to publish adult content, including women/women content, set memberships, and earn from their audience.</p>
            </div>
            <p className="creator-account-status">Creator onboarding, age and identity verification, publishing, and payouts are not active yet. This preview will not create or grant a creator account.</p>
            <Link className="vixen-email-submit creator-member-link" href="/creator/studio">Preview the creator workspace</Link>
            <Link className="vixen-email-submit creator-member-link" href={accountHref("member")}>Create a free member account</Link>
          </section>
        )}
        <Link className="vixen-signup-back" href="/">← Back to VIXEN</Link>
      </div>
    </main>
  );
}
