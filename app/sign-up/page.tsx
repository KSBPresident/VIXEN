import Image from "next/image";
import Link from "next/link";
import { SocialSignUp } from "@/components/auth/social-sign-up";
import { EmailAccountAccess } from "@/components/auth/email-account-access";

export const metadata = { title: "Create your account", description: "Create a free VIXEN account with email or a connected sign-in." };

type SignUpProps = { searchParams: Promise<{ next?: string | string[]; error?: string | string[] }> };

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
        <p className="vixen-signup-subtitle">Your creative world starts here.</p>
        <section className="vixen-auth-card" aria-label="Create a VIXEN account">
          {callbackFailed && <p className="vixen-auth-alert" role="alert">We couldn’t complete sign-up. Please try your provider again.</p>}
          <div className="vixen-auth-card-heading">
            <p className="vixen-kicker">CREATE ACCOUNT</p>
            <h2>Choose how to continue</h2>
            <p>Create an account directly with VIXEN, including with a Proton Mail address.</p>
          </div>
          <EmailAccountAccess configured={supabaseConfigured} nextPath={nextPath} />
          <div className="vixen-auth-divider"><span>OR USE A CONNECTED ACCOUNT</span></div>
          <SocialSignUp configured={supabaseConfigured} nextPath={nextPath} />
          <p className="vixen-auth-caption">Proton Mail is your email address here, not a Proton single-sign-on provider.</p>
        </section>
        <Link className="vixen-signup-back" href="/">← Back to VIXEN</Link>
      </div>
    </main>
  );
}
