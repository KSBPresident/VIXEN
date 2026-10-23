import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ProfileEditor } from "@/components/account/profile-editor";
import { createClient } from "@/lib/supabase/server";
import { isVixenPlatformAdmin } from "@/lib/server/platform-admin";
import { signOut } from "./actions";

export const dynamic = "force-dynamic";
export const metadata = { title: "Your account", robots: { index: false, follow: false } };

export default async function AccountPage() {
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
          {applicationStatus === "pending" && <p className="creator-account-status" role="status">Application status: Pending review</p>}
          {applicationStatus === "rejected" && <p className="creator-account-status" role="status">Application status: Not approved</p>}
          <ProfileEditor username={profile?.username ?? ""} displayName={profile?.display_name ?? ""} />
          {isPlatformOwner && <p><Link className="vixen-discover-link" href="/admin">Open administrator console <span aria-hidden="true">→</span></Link></p>}
          {isCreator && <p><Link className="vixen-discover-link" href="/creator/earnings">View earnings and request a withdrawal <span aria-hidden="true">→</span></Link></p>}
          {isCreator && <p><Link className="vixen-discover-link" href="/creator/profile">Manage your public creator profile <span aria-hidden="true">→</span></Link></p>}
          {isCreator && <p><Link className="vixen-discover-link" href="/creator/studio">Open creator workspace preview <span aria-hidden="true">→</span></Link></p>}
          <p><Link className="vixen-discover-link" href="/member-preview">Open member app preview <span aria-hidden="true">→</span></Link></p>
          <p className="vixen-auth-caption">Creator payment proofs, earnings, and withdrawal requests use manual administrator review. Creator content, paid memberships, messages, checkout, bookings, and video rooms remain separate features with their own launch status.</p>
        </div>
      </section>
    </main>
  );
}
