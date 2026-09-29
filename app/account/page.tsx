import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { signOut } from "./actions";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Your account", robots: { index: false, follow: false } };

export default async function AccountPage() {
  const supabase = await createClient();
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
          <p className="vixen-kicker">YOUR ACCOUNT</p>
          <h1>Welcome to VIXEN.</h1>
          <p>Your account is connected. Start by exploring the creator preview.</p>
          <span className="vixen-account-email">{user.email ?? "VIXEN member"}</span>
          <p><Link className="vixen-discover-link" href="/creators">Discover creators <span aria-hidden="true">→</span></Link></p>
        </div>
      </section>
    </main>
  );
}
