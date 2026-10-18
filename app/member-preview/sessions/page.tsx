import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import "../member-preview.css";
import "../member-interactions.css";
import "../member-search.css";
import { SessionBookingPreview } from "@/components/member/session-booking-preview";

export const metadata = {
  title: "Private video preview",
  description: "Preview private browser-based video calls with VIXEN creators.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const creators = [
  { slug: "nova-luxe", name: "Nova Luxe", initials: "NL", category: "Music · Culture", tone: "rose", intro: "Book a private one-to-one video call, if offered by the creator.", sampleLength: "15 minutes", samplePrice: "$24.00" },
  { slug: "vee-saint", name: "Vee Saint", initials: "VS", category: "Style · Behind the scenes", tone: "silver", intro: "The creator sets call availability, session length, price, and boundaries.", sampleLength: "20 minutes", samplePrice: "$32.00" },
  { slug: "kira-moss", name: "Kira Moss", initials: "KM", category: "Art · Studio life", tone: "violet", intro: "Meet in a browser-based VIXEN call when the creator chooses to offer one.", sampleLength: "15 minutes", samplePrice: "$18.00" },
];

type MemberSessionsPageProps = { searchParams: Promise<{ creator?: string | string[] }> };

export default async function MemberSessionsPreviewPage({ searchParams }: MemberSessionsPageProps) {
  let isSignedIn = false;
  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  );
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
  const accountLabel = isSignedIn ? "My account" : "Create free account";
  const params = await searchParams;
  const creatorParam = Array.isArray(params.creator) ? params.creator[0] : params.creator;
  const initialCreatorSlug = creators.some((creator) => creator.slug === creatorParam) ? creatorParam : undefined;

  return (
    <main className="member-app">
      <header className="member-topbar">
        <Link href="/" className="member-brand" aria-label="VIXEN home">
          <Image src="/assets/vixen-mark-3d.png" alt="" width={62} height={62} priority />
          <span>VIXEN</span>
        </Link>
        <form className="member-search" action="/creators" role="search" aria-label="Search creators"><span aria-hidden="true">⌕</span><label className="visually-hidden" htmlFor="member-creator-search">Search creators and interests</label><input id="member-creator-search" type="search" name="q" placeholder="Search creators and interests" /><button type="submit" aria-label="Search creators">↵</button></form>
        <div className="member-top-actions"><span className="member-preview-pill"><i /> PREVIEW</span><Link href={accountHref}>{accountLabel} <b aria-hidden="true">↗</b></Link></div>
      </header>

      <div className="member-shell">
        <aside className="member-sidebar">
          <p className="member-sidebar-label">YOUR VIXEN</p>
          <nav className="member-sidebar-navigation" aria-label="Member app navigation">
            <Link className="member-nav-item" href="/member-preview"><span>▦</span> For you</Link>
            <Link className="member-nav-item" href="/creators"><span>⌕</span> Discover creators</Link>
            <Link className="member-nav-item" href="/pricing"><span>◇</span> Memberships</Link>
            <Link className="interaction-sidebar-link" href="/member-preview/sessions" aria-current="page"><span>◉</span> Private video</Link>
            <Link className="member-nav-item" href="/member-preview/messages"><span>✉</span> Messages</Link>
            <Link className="member-nav-item" href="/store"><span>⌑</span> Store</Link>
          </nav>
          <div className="member-sidebar-card"><span className="member-sidebar-spark">✦</span><strong>{isSignedIn ? "Your account is active" : "Your VIXEN account"}</strong><p>{isSignedIn ? "Manage your VIXEN profile and account settings." : "VIXEN accounts are available; private video remains a preview."}</p><Link href={accountHref}>{isSignedIn ? "Open account" : "Join free"} <span aria-hidden="true">→</span></Link></div>
          <div className="member-sidebar-foot"><span>Adults 18+ only</span><span>Verified Interactive Xperience &amp; Entertainment Network</span></div>
        </aside>

        <section className="member-main interaction-workspace" aria-labelledby="sessions-heading">
          <header>
            <p className="member-eyebrow"><span /> MEMBER APP · PREVIEW</p>
            <h1 className="interaction-page-title" id="sessions-heading">Private video</h1>
            <p className="interaction-page-intro">Choose a creator, review the one-time call price and terms, then book and meet in VIXEN on a supported phone or computer browser.</p>
          </header>
          <div className="interaction-status" role="note"><span className="interaction-status-mark" aria-hidden="true">ⓘ</span><span><strong>Paid bookings aren’t active yet.</strong> The profiles and prices below are illustrative. No time can be reserved and no payment or call will start.</span></div>
          <div className="interaction-status" role="note"><span className="interaction-status-mark" aria-hidden="true">▣</span><span><strong>Pay per confirmed call.</strong> The displayed example is a one-time session price, separate from creator subscriptions. Taxes, fees, final terms, and the total must be shown before real payment.</span></div>
          <div className="interaction-status" role="note"><span className="interaction-status-mark" aria-hidden="true">◉</span><span><strong>You control device access.</strong> Your camera and microphone stay off until you choose to enter an authorized live call and grant permission in your browser.</span></div>

          <SessionBookingPreview creators={creators} initialCreatorSlug={initialCreatorSlug} />
        </section>

        <aside className="member-right-rail" aria-label="Session information">
          <section className="member-rail-card"><p className="member-eyebrow">CREATOR CONTROL</p><h2>Clear terms before you book.</h2><p>Each call must show the creator, duration, one-time price, local availability, cancellation terms, and boundaries before payment.</p></section>
          <section className="member-rail-card member-tier-card"><p className="member-eyebrow">PRIVATE BY DESIGN</p><h2>Meet on VIXEN.</h2><p>A confirmed in-app payment unlocks only that booked call. Membership or VVIP status alone does not unlock a call. Camera and microphone permission is requested only when you choose to enter.</p></section>
          <p className="member-rail-foot">Sample profiles only. Real creator calendars, payments, and video rooms are not connected.</p>
        </aside>
      </div>

      <nav className="member-mobile-nav" aria-label="Member app navigation"><Link href="/member-preview"><span>▦</span>Home</Link><Link href="/creators"><span>⌕</span>Discover</Link><Link href="/member-preview/messages"><span>✉</span>Messages</Link><Link href="/member-preview/sessions" aria-current="page"><span>◉</span>Video</Link><Link href={accountHref}><span>◉</span>{isSignedIn ? "Account" : "Join"}</Link></nav>
    </main>
  );
}
