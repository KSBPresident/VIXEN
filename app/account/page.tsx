import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ProfileEditor } from "@/components/account/profile-editor";
import { createClient } from "@/lib/supabase/server";
import { isVixenPlatformAdmin } from "@/lib/server/platform-admin";
import { applyForCreator, signOut } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Your account", robots: { index: false, follow: false } };

type AccountPageProps = { searchParams: Promise<{ creatorApplication?: string }> };

const applicationNotices: Record<string, string> = {
  submitted: "Your creator application is submitted for admin review. Your member profile and login stay the same; creator tools remain locked until approval and verification.",
  "already-pending": "Your creator application is already waiting for admin review.",
  "already-approved": "Your creator application is approved. Sign out and back in if creator access is not yet showing.",
  "already-creator": "Creator access is already enabled for this account.",
  "already-submitted": "An application already exists for this account. Contact VIXEN support if you need help.",
  "contact-admin": "This account has a prior decision. Contact VIXEN support to request another review.",
  "attestation-required": "Confirm the eligibility statement before sending your application.",
  unavailable: "We couldn't submit your application right now. Please try again.",
};

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const params = await searchParams;
  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  );

  if (!supabaseConfigured) {
    return (
      <main className="vixen-home">
        <header className="vixen-account-topbar">
          <Link href="/" aria-label="VIXEN home">
            <Image src="/assets/vixen-mark-3d.png" alt="VIXEN emblem" width={200} height={200} priority />
          </Link>
        </header>
        <section className="vixen-account-content">
          <div className="vixen-account-panel">
            <p className="vixen-kicker">MEMBER ACCOUNT</p>
            <h1>Sign-in is being connected.</h1>
            <p>VIXEN account access will be available as soon as its dedicated authentication service is configured.</p>
            <p className="vixen-auth-caption">Your account and password have not been created. Please come back after VIXEN authentication setup is complete.</p>
            <p><Link className="vixen-discover-link" href="/sign-up?type=member">View member sign-up <span aria-hidden="true">→</span></Link></p>
          </div>
        </section>
      </main>
    );
  }

  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect("/sign-up?type=member&mode=signin&next=%2Faccount");

  const isPlatformOwner = isVixenPlatformAdmin(user);
  const [{ data: profile }, { data: creatorApplication }] = await Promise.all([
    supabase.from("profiles").select("is_creator, username, display_name").eq("id", user.id).maybeSingle(),
    supabase.from("creator_applications").select("status").eq("user_id", user.id).maybeSingle(),
  ]);
  const isCreator = profile?.is_creator === true;
  const applicationStatus = creatorApplication?.status;
  const notice = params.creatorApplication ? applicationNotices[params.creatorApplication] : undefined;
  const canApply = !isPlatformOwner && !isCreator && !applicationStatus;

  return (
    <main className="vixen-home">
      <header className="vixen-account-topbar">
        <Link href="/" aria-label="VIXEN home"><Image src="/assets/vixen-mark-3d.png" alt="VIXEN emblem" width={200} height={200} priority /></Link>
        <form action={signOut}><button type="submit">Sign out</button></form>
      </header>
      <section className="vixen-account-content">
        <div className="vixen-account-panel">
          <p className="vixen-kicker">{isPlatformOwner ? "VIXEN PLATFORM OWNER" : isCreator ? "APPROVED CREATOR ACCOUNT" : applicationStatus ? "CREATOR APPLICATION" : "FREE MEMBER ACCOUNT"}</p>
          <h1>{isPlatformOwner ? "Welcome, VIXEN administrator." : applicationStatus === "pending" ? "Your application is in review." : applicationStatus === "rejected" ? "Your member account is ready." : "Welcome to VIXEN."}</h1>
          <p>{isPlatformOwner
            ? "This confirmed platform-owner account has free, tier-independent access to creator content. Content review access is tied to this email only."
            : applicationStatus === "pending"
              ? "Your creator application was received. Creator publishing and earnings stay locked until VIXEN completes age and identity verification and approves the application."
              : applicationStatus === "rejected"
                ? "Your creator application was not approved. You can keep using your free member account."
                : isCreator
                  ? "Your creator access has been approved. The creator workspace shown below is still a product preview; publishing and payouts are not active."
                  : "Your free member login is active. You can explore the member app preview and choose access levels as they become available."}</p>
          <span className="vixen-account-email">{user.email ?? "VIXEN member"}</span>
          {notice && <p className="creator-account-status" role="status">{notice}</p>}
          {applicationStatus === "pending" && <p className="creator-account-status" role="status">Application status: Pending review</p>}
          {applicationStatus === "rejected" && <p className="creator-account-status" role="status">Application status: Not approved</p>}
          <ProfileEditor username={profile?.username ?? ""} displayName={profile?.display_name ?? ""} />
          {canApply && <section className="vixen-creator-apply">
            <p className="vixen-kicker">CREATOR PROFILE</p>
            <h2>Apply from this account</h2>
            <p>Keep your personal member login. Submit a creator application here; an admin will review it before enabling a creator profile or publishing tools.</p>
            <form action={applyForCreator}>
              <label><input type="checkbox" name="adultCreatorAttestation" required /> I am an adult woman aged 18 or older, and I agree to complete VIXEN’s age and identity verification before creator access is activated.</label>
              <button type="submit">Apply for creator access</button>
            </form>
          </section>}
          {applicationStatus === "pending" && <p className="creator-account-status">You can continue using this same account while the admin reviews your application.</p>}
          {applicationStatus === "rejected" && <p className="vixen-auth-caption">To request another review, contact VIXEN support. You do not need to create a second member account.</p>}
          {isPlatformOwner && <p><Link className="vixen-discover-link" href="/admin">Open administrator console <span aria-hidden="true">→</span></Link></p>}
          {isCreator && <p><Link className="vixen-discover-link" href="/creator/earnings">View earnings and request a withdrawal <span aria-hidden="true">→</span></Link></p>}
          {isCreator && <p><Link className="vixen-discover-link" href="/creator/profile">Manage your public creator profile <span aria-hidden="true">→</span></Link></p>}
          {isCreator && <p><Link className="vixen-discover-link" href="/creator/studio">Open creator workspace preview <span aria-hidden="true">→</span></Link></p>}
          <p><Link className="vixen-discover-link" href="/member-preview">Open member app preview <span aria-hidden="true">→</span></Link></p>
          <p className="vixen-auth-caption">Creator payment proofs, earnings, and withdrawal requests use manual administrator review. Creator content, paid memberships, messages, checkout, bookings, and video rooms remain separate features with their own launch status.</p>
        </div>
      </section>
      <style>{".vixen-creator-apply{margin:24px 0;padding:20px;border:1px solid rgba(255,63,155,.45);border-radius:16px;background:rgba(255,63,155,.05)}.vixen-creator-apply h2{margin:6px 0 10px}.vixen-creator-apply p:not(.vixen-kicker){color:#c9bdcc;font-size:14px;line-height:1.6}.vixen-creator-apply form{display:grid;gap:16px;margin-top:16px}.vixen-creator-apply label{display:flex;align-items:flex-start;gap:10px;color:#eee;font-size:13px;line-height:1.6}.vixen-creator-apply input{margin-top:4px;accent-color:#f22a91}.vixen-creator-apply button{min-height:48px;border:0;border-radius:9px;background:linear-gradient(110deg,#f22a91,#b90d68);color:white;font-weight:700;cursor:pointer}"}</style>
    </main>
  );
}
