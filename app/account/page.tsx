import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "./actions";
import { createClient } from "@/lib/supabase/server";

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

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) redirect("/sign-up?next=%2Faccount");

  return (
    <main className="vixen-home">
      <header className="vixen-account-topbar">
        <Link href="/" aria-label="VIXEN home"><Image src="/assets/vixen-mark-3d.png" alt="VIXEN emblem" width={200} height={200} priority /></Link>
        <form action={signOut}><button type="submit">Sign out</button></form>
      </header>
      <section className="vixen-account-content">
        <div className="vixen-account-panel">
          <p className="vixen-kicker">YOUR MEMBER ACCOUNT</p>
          <h1>Welcome to VIXEN.</h1>
          <p>You’re signed in. Open the member app preview to explore creator profiles and see how VIXEN’s feed and membership choices are designed.</p>
          <span className="vixen-account-email">{user.email ?? "VIXEN member"}</span>
          <p><Link className="vixen-discover-link" href="/member-preview">Open your member app <span aria-hidden="true">→</span></Link></p>
          <p className="vixen-auth-caption">Creator profiles and posts are samples. Real creator content, memberships, messages, and checkout are not active yet.</p>
        </div>
      </section>
    </main>
  );
}
