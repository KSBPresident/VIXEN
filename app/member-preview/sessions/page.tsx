import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import "../member-preview.css";
import "../member-interactions.css";
import "../member-search.css";

export const metadata = {
  title: "Private video · VIXEN",
  description: "VIXEN private browser video session availability.",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function MemberSessionsPage() {
  let isSignedIn = false;
  let hasApprovedCreators = false;
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY));
  if (configured) {
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      isSignedIn = Boolean(user);
      const { count, error } = await supabase.from("profiles").select("id", { count: "exact", head: true }).eq("is_creator", true);
      hasApprovedCreators = !error && (count ?? 0) > 0;
    } catch { isSignedIn = false; }
  }
  const accountHref = isSignedIn ? "/account" : "/sign-up?type=member";

  return (
    <main className="member-app">
      <header className="member-topbar"><Link href="/" className="member-brand" aria-label="VIXEN home"><Image src="/assets/vixen-mark-3d.png" alt="" width={62} height={62} priority /><span>VIXEN</span></Link><div className="member-top-actions"><span className="member-preview-pill"><i /> PREVIEW</span><Link href={accountHref}>{isSignedIn ? "My account" : "Create free account"} <b aria-hidden="true">↗</b></Link></div></header>
      <div className="member-shell">
        <aside className="member-sidebar"><p className="member-sidebar-label">YOUR VIXEN</p><nav className="member-sidebar-navigation" aria-label="Member app navigation">
          <Link className="member-nav-item" href="/member-preview"><span>▦</span> For you</Link><Link className="member-nav-item" href="/creators"><span>⌕</span> Discover creators</Link><Link className="member-nav-item" href="/pricing"><span>◇</span> Memberships</Link><Link className="interaction-sidebar-link" href="/member-preview/sessions" aria-current="page"><span>◉</span> Private video</Link><Link className="member-nav-item" href="/member-preview/messages"><span>✉</span> vMessage</Link><Link className="member-nav-item" href="/store"><span>⌑</span> Store</Link>
        </nav><div className="member-sidebar-card"><span className="member-sidebar-spark">✦</span><strong>{isSignedIn ? "Your account is active" : "Your VIXEN account"}</strong><p>Private video booking has not opened yet.</p><Link href={accountHref}>{isSignedIn ? "Open account" : "Join free"} <span aria-hidden="true">→</span></Link></div><div className="member-sidebar-foot"><span>Adults 18+ only</span><span>Verified Interactive Xperience &amp; Entertainment Network</span></div></aside>

        <section className="member-main interaction-workspace" aria-labelledby="sessions-heading">
          <header><p className="member-eyebrow"><span /> MEMBER APP · PREVIEW</p><h1 className="interaction-page-title" id="sessions-heading">Private video</h1><p className="interaction-page-intro">Creators will be able to offer browser-based private sessions with clear availability, duration, price, and boundaries.</p></header>
          <div className="interaction-status" role="note"><span className="interaction-status-mark" aria-hidden="true">ⓘ</span><span><strong>Bookings and calls are not live.</strong> No sample prices or availability are shown. No booking can be reserved or paid for yet.</span></div>
          <section className="creator-profile-feed-empty"><p className="member-eyebrow">SESSION AVAILABILITY</p><h2>{hasApprovedCreators ? "No live sessions listed." : "Creator sessions are coming soon."}</h2><p>{hasApprovedCreators ? "Approved creator profiles exist, but no live video-session availability is configured." : "No approved creator is currently offering a VIXEN video session."}</p><Link href="/creators">Browse approved creators <span aria-hidden="true">→</span></Link></section>
        </section>

        <aside className="member-right-rail" aria-label="Session information"><section className="member-rail-card"><p className="member-eyebrow">CREATOR CONTROL</p><h2>Clear terms before you book.</h2><p>Before calls open, VIXEN must display creator-set availability, price, duration, consent boundaries, cancellation terms, and device permissions.</p><Link href="/about">Learn about VIXEN <span aria-hidden="true">→</span></Link></section><section className="member-rail-card member-tier-card"><p className="member-eyebrow">MEMBER TOOLS</p><h2>Choose how you connect.</h2><p>Memberships and private sessions are separate purchases. Neither is available for checkout yet.</p><Link href="/pricing">Review memberships <span aria-hidden="true">→</span></section><p className="member-rail-foot">No sample creator identities, prices, or availability are shown.</p></aside>
      </div>
      <nav className="member-mobile-nav" aria-label="Member app navigation"><Link href="/member-preview"><span>▦</span>Home</Link><Link href="/creators"><span>⌕</span>Discover</Link><Link href="/pricing"><span>◇</span>Plans</Link><Link href="/member-preview/messages"><span>✉</span>Inbox</Link><Link href={accountHref}><span>◉</span>Account</Link></nav>
    </main>
  );
}
