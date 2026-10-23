import Image from "next/image";
import Link from "next/link";
import { LaunchCountdown } from "@/components/launch-countdown";
import { createClient } from "@/lib/supabase/server";
import "./app-home.css";

const nav = [
  ["⌂", "Home", "/", false], ["▦", "For you", "/member-preview", false],
  ["⌕", "Discover", "/creators", false], ["◇", "Memberships", "/pricing", false],
  ["▣", "Store", "/store", false], ["₿", "Crypto payments", "/crypto-payments", false], ["♡", "Donate", "/donate", false], ["✉", "Messages", "/member-preview/messages", true],
  ["◉", "Private video", "/member-preview/sessions", true],
] as const;

const tiles = [
  ["▦", "Your feed", "Explore sample creator updates in the member app.", "/member-preview", "PREVIEW"],
  ["⌕", "Discover creators", "Browse profiles and find your people.", "/creators", "EXPLORE"],
  ["✉", "Messages", "See the conversation experience. Sending is not active yet.", "/member-preview/messages", "PREVIEW"],
  ["◉", "Private video", "Review the planned paid session flow. No calls are active.", "/member-preview/sessions", "PREVIEW"],
  ["₿", "Crypto payments", "USDT, USDC, and TRX wallet transfers are available for manually arranged orders.", "/crypto-payments", "MANUAL"],
  ["♡", "Support VIXEN", "Make a voluntary wallet contribution. Donations do not unlock paid access.", "/donate", "DONATE"],
] as const;

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let isSignedIn = false;
  const supabaseConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY));
  if (supabaseConfigured) {
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      isSignedIn = Boolean(user);
    } catch {
      isSignedIn = false;
    }
  }
  const accountHref = isSignedIn ? "/account" : "/sign-up?type=member";

  return (
    <main className="vixen-app">
      <aside className="app-sidebar" aria-label="VIXEN app navigation">
        <Link className="app-brand" href="/" aria-label="VIXEN home"><Image src="/assets/vixen-mark-3d.png" alt="" width={64} height={64} priority /><span>VIXEN<small>CREATOR + MEMBER APP</small></span></Link>
        <p className="app-sidebar-label">WORKSPACE</p>
        <nav className="app-nav" aria-label="Main navigation">{nav.map(([icon,label,href,preview]) => <Link key={label} href={href} className={href === "/" ? "app-nav-link is-current" : "app-nav-link"} aria-current={href === "/" ? "page" : undefined}><i aria-hidden="true">{icon}</i><span>{label}</span>{preview && <small>Preview</small>}</Link>)}</nav>
        <div className="app-sidebar-bottom"><p><b>18+</b> For adults only. Respect consent and creator boundaries.</p><Link href="/about">About VIXEN <span>↗</span></Link><small>Verified Interactive Xperience &amp; Entertainment Network</small></div>
      </aside>

      <div className="app-main">
        <header className="app-topbar"><div className="app-crumb"><span>VIXEN</span><b>/</b><strong>Home</strong></div><div className="app-actions"><Link href="/creators" className="app-find"><span>⌕</span> Find creators</Link>{isSignedIn ? <Link className="app-create" href="/account">My account ↗</Link> : <><Link href="/account">Sign in</Link><Link className="app-create" href="/sign-up?type=member">Create account ↗</Link></>}</div></header>
        <div className="app-content">
          <div className="app-dashboard">
            <div className="app-primary">
              <LaunchCountdown />
              <section className="app-hero"><div><p className="app-kicker">YOUR CREATOR + MEMBER SPACE</p><h1>Your VIXEN.<br/><em>Your way.</em></h1><p>Discover creators, explore memberships, and choose the account that fits you. Start free as a member.</p><div className="app-hero-actions"><Link className="app-button" href="/member-preview">Explore the member app →</Link><Link href={accountHref}>{isSignedIn ? "Open your account" : "Create free account"}</Link></div></div><Image src="/assets/vixen-mark-3d.png" alt="" aria-hidden="true" width={180} height={180}/></section>
              <section className="app-section"><div className="app-section-head"><div><p className="app-kicker">YOUR SPACE</p><h2>Jump back in</h2></div><Link href="/creators">Browse all →</Link></div><div className="app-tiles">{tiles.map(([icon,title,description,href,status])=><Link className="app-tile" href={href} key={title}><span className="app-tile-meta"><i aria-hidden="true">{icon}</i><small>{status}</small></span><strong>{title}</strong><span>{description}</span><b>Open →</b></Link>)}</div></section>
              <section className="app-section"><div className="app-section-head"><div><p className="app-kicker">TWO SEPARATE ACCOUNT PATHS</p><h2>Choose your account</h2></div><Link href={accountHref}>{isSignedIn ? "Open account →" : "Account access →"}</Link></div><div className="app-account-cards">
                <article><small>MEMBER · FREE · 18+</small><h3>Watch and connect</h3><p>Create a free login to explore VIXEN. Choose paid access only when it is available and you want it.</p><Link href={accountHref}>{isSignedIn ? "Open member account →" : "Join as a member →"}</Link></article>
                <article className="creator"><small>CREATOR · APPLICATION</small><h3>Create and earn</h3><p>Adult women can apply for a separate creator account. Publishing and earnings unlock only after review.</p><Link href="/sign-up?type=creator">Creator application →</Link></article>
              </div></section>
            </div>
            <aside className="app-rail" aria-label="Account and feature status">
              <section className="app-rail-card"><p className="app-kicker">MEMBER ACCESS</p><h2>Start free.</h2><p>A free member login is available. Crypto wallet transfers are available by manual arrangement. Membership checkout, paid posts, messages, private video, and store checkout are not active yet.</p><Link className="app-rail-cta" href={accountHref}>{isSignedIn ? "Open your account" : "Create a free account"}</Link>{!isSignedIn && <Link className="app-rail-link" href="/account">Already a member? Sign in</Link>}</section>
              <section className="app-rail-card"><p className="app-kicker">MEMBERSHIP LEVELS</p><h2>Know what unlocks.</h2><div className="app-tier"><b>Standard</b><span>Free member account</span></div><div className="app-tier"><b>VIP / VVIP</b><span>Optional paid levels · not active</span></div><p className="app-note">VIP/VVIP club access is 21+ and requires an active membership card. The upgrades and entry checks are not live yet.</p><Link className="app-rail-link" href="/pricing">See access details →</Link></section>
              <section className="app-rail-card app-status"><p className="app-kicker">FEATURE STATUS</p><div><i className="live"/> <span><b>Account signup</b><small>Email/password available</small></span><strong>LIVE</strong></div><div><i/> <span><b>Creator tools</b><small>Application/workspace preview</small></span><strong>PREVIEW</strong></div><div><i/> <span><b>Paid services</b><small>Payments and fulfillment not connected</small></span><strong>NOT LIVE</strong></div></section>
            </aside>
          </div>
        </div>
        <footer className="app-footer"><span>© {new Date().getFullYear()} VIXEN</span><span>Website Designed &amp; Developed by <strong>Nebula Interstellar Networking Economy LLC.</strong></span><Link href="/donate">Donate</Link><Link href="/about">About VIXEN</Link></footer>
        <nav className="app-mobile-nav" aria-label="Mobile app navigation"><Link href="/member-preview"><span>▦</span><small>Feed</small></Link><Link href="/creators"><span>⌕</span><small>Discover</small></Link><Link href="/member-preview/messages"><span>✉</span><small>Inbox</small></Link><Link href="/member-preview/sessions"><span>◉</span><small>Video</small></Link><Link href="/account"><span>◌</span><small>Account</small></Link></nav>
      </div>
    </main>
  );
}
