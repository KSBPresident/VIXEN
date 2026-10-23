import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import "../member-preview.css";
import "../member-interactions.css";
import "../member-search.css";

export const metadata = {
  title: "vMessage · VIXEN",
  description: "VIXEN creator messaging status and account access.",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function MemberMessagesPage() {
  let isSignedIn = false;
  const configured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY));
  if (configured) {
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      isSignedIn = Boolean(user);
    } catch { isSignedIn = false; }
  }
  const accountHref = isSignedIn ? "/account" : "/sign-up?type=member";

  return (
    <main className="member-app">
      <header className="member-topbar"><Link href="/" className="member-brand" aria-label="VIXEN home"><Image src="/assets/vixen-mark-3d.png" alt="" width={62} height={62} priority /><span>VIXEN</span></Link><div className="member-top-actions"><span className="member-preview-pill"><i /> PREVIEW</span><Link href={accountHref}>{isSignedIn ? "My account" : "Create free account"} <b aria-hidden="true">↗</b></Link></div></header>
      <div className="member-shell">
        <aside className="member-sidebar"><p className="member-sidebar-label">YOUR VIXEN</p><nav className="member-sidebar-navigation" aria-label="Member app navigation">
          <Link className="member-nav-item" href="/member-preview"><span>▦</span> For you</Link>
          <Link className="member-nav-item" href="/creators"><span>⌕</span> Discover creators</Link>
          <Link className="member-nav-item" href="/pricing"><span>◇</span> Memberships</Link>
          <Link className="member-nav-item" href="/member-preview/sessions"><span>◉</span> Private video</Link>
          <Link className="interaction-sidebar-link" href="/member-preview/messages" aria-current="page"><span>✉</span> vMessage</Link>
          <Link className="member-nav-item" href="/store"><span>⌑</span> Store</Link>
        </nav><div className="member-sidebar-card"><span className="member-sidebar-spark">✦</span><strong>{isSignedIn ? "Your account is active" : "Your VIXEN account"}</strong><p>VIXEN account settings are available. Messaging delivery is still being prepared.</p><Link href={accountHref}>{isSignedIn ? "Open account" : "Join free"} <span aria-hidden="true">→</span></Link></div><div className="member-sidebar-foot"><span>Adults 18+ only</span><span>Verified Interactive Xperience &amp; Entertainment Network</span></div></aside>

        <section className="member-main interaction-workspace" aria-labelledby="messages-heading">
          <header><p className="member-eyebrow"><span /> MEMBER APP · PREVIEW</p><h1 className="interaction-page-title" id="messages-heading">vMessage</h1><p className="interaction-page-intro">Private creator messaging is planned for the VIXEN member workspace.</p></header>
          <div className="interaction-status" role="note"><span className="interaction-status-mark" aria-hidden="true">ⓘ</span><span><strong>Messaging is not live yet.</strong> No fictional conversations are shown. Message delivery, paid media, notifications, and encryption have not been activated.</span></div>
          <section className="creator-profile-feed-empty"><p className="member-eyebrow">YOUR INBOX</p><h2>No conversations yet.</h2><p>When messaging is ready and you start a conversation with an approved creator, it will appear here.</p><Link href="/creators">Discover approved creators <span aria-hidden="true">→</span></Link></section>
        </section>

        <aside className="member-right-rail" aria-label="Messaging status"><section className="member-rail-card"><p className="member-eyebrow">PRIVATE VIDEO</p><h2>Meet face to face.</h2><p>Browser video sessions are not active yet. No call can be booked or paid for here.</p><Link href="/member-preview/sessions">View session status <span aria-hidden="true">→</span></Link></section><section className="member-rail-card member-tier-card"><p className="member-eyebrow">YOUR CONTROL</p><h2>Clear boundaries.</h2><p>Messaging will open after privacy, consent, pricing, and reporting controls are ready.</p><Link href="/about">Learn about VIXEN <span aria-hidden="true">→</span></Link></section><p className="member-rail-foot">No sample conversations or creator identities are displayed.</p></aside>
      </div>
      <nav className="member-mobile-nav" aria-label="Member app navigation"><Link href="/member-preview"><span>▦</span>Home</Link><Link href="/creators"><span>⌕</span>Discover</Link><Link href="/pricing"><span>◇</span>Plans</Link><Link href="/member-preview/sessions"><span>◉</span>Video</Link><Link href={accountHref}><span>◉</span>Account</Link></nav>
    </main>
  );
}
