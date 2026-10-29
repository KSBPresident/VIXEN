import Link from "next/link";
import { redirect } from "next/navigation";
import { CreatorAccountActivation } from "@/components/auth/creator-account-activation";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Set up your approved creator account · VIXEN", robots: { index: false, follow: false } };

type Props = { searchParams: Promise<{ application?: string; token?: string }> };

export default async function CreatorSetupPage({ searchParams }: Props) {
  const params = await searchParams;
  const applicationId = params.application ?? "";
  const token = params.token ?? "";
  if (!/^[0-9a-f-]{36}$/i.test(applicationId) || !/^[A-Za-z0-9_-]{40,60}$/.test(token)) {
    return <main className="vixen-home"><section className="vixen-account-content"><div className="vixen-account-panel"><p className="vixen-kicker">CREATOR INVITATION</p><h1>This account link is invalid.</h1><p>Contact VIXEN admin and ask for a new invitation link.</p><Link href="/sign-up?type=creator">Creator application information</Link></div></section></main>;
  }

  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY));
  if (!configured) return <main className="vixen-home"><section className="vixen-account-content"><div className="vixen-account-panel"><h1>Account setup is unavailable.</h1><p>VIXEN’s account service is not configured.</p></div></section></main>;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any).rpc("claim_creator_invitation", { p_application_id: applicationId, p_token: token });
    if (!error && data === true) redirect("/creator/profile?setup=complete");
    return <main className="vixen-home"><section className="vixen-account-content"><div className="vixen-account-panel"><p className="vixen-kicker">CREATOR INVITATION</p><h1>We couldn’t activate this creator invitation.</h1><p>The confirmation email must match the address approved by VIXEN, and the one-time link must not have expired. Sign out of any other VIXEN account and try again, or contact the administrator who reviewed your application.</p><Link href="/account">Open account</Link></div></section></main>;
  }

  return <main className="vixen-home"><header className="vixen-account-topbar"><Link href="/">VIXEN</Link></header><section className="vixen-account-content"><div className="vixen-account-panel">
    <p className="vixen-kicker">APPLICATION APPROVED · EMAIL CONFIRMATION REQUIRED</p>
    <h1>Set up your creator account.</h1>
    <p>Your application has been approved. Create a VIXEN login with the email address that received the invitation, then confirm that address from your inbox. Creator tools unlock after the verified email claims this one-time approval.</p>
    <CreatorAccountActivation applicationId={applicationId} token={token} configured={configured} />
  </div></section></main>;
}
