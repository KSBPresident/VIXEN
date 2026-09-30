import Image from "next/image";
import Link from "next/link";
import "../member-preview.css";
import "../member-interactions.css";
import "../member-search.css";
import { SessionBookingPreview } from "@/components/member/session-booking-preview";

export const metadata = {
  title: "Private video preview",
  description: "Preview planned private browser-based video sessions with VIXEN creators.",
  robots: { index: false, follow: false },
};

const creators = [
  { slug: "nova-luxe", name: "Nova Luxe", initials: "NL", category: "Music · Culture", tone: "rose", intro: "A private one-to-one video session, if offered by the creator.", sampleLength: "15 minutes", samplePrice: "24.00" },
  { slug: "vee-saint", name: "Vee Saint", initials: "VS", category: "Style · Behind the scenes", tone: "silver", intro: "Creator-controlled availability, session length, price, and boundaries.", sampleLength: "20 minutes", samplePrice: "32.00" },
  { slug: "kira-moss", name: "Kira Moss", initials: "KM", category: "Art · Studio life", tone: "violet", intro: "Meet in a browser-based VIXEN session when the creator chooses to offer one.", sampleLength: "15 minutes", samplePrice: "18.00" },
];

export default function MemberSessionsPreviewPage() {
  return (
    <main className="member-app">
      <header className="member-topbar">
        <Link href="/" className="member-brand" aria-label="VIXEN home">
          <Image src="/assets/vixen-mark-3d.png" alt="" width={62} height={62} priority />
          <span>VIXEN</span>
        </Link>
        <form className="member-search" action="/creators" role="search" aria-label="Search creators"><span aria-hidden="true">⌕</span><label className="visually-hidden" htmlFor="member-creator-search">Search creators and interests</label><input id="member-creator-search" type="search" name="q" placeholder="Search creators and interests" /><button type="submit" aria-label="Search creators">↵</button></form>
        <div className="member-top-actions"><span className="member-preview-pill"><i /> PREVIEW</span><Link href="/sign-up?type=member">Create free account <b aria-hidden="true">↗</b></Link></div>
      </header>

      <div className="member-shell">
        <aside className="member-sidebar" aria-label="Member app navigation">
          <p className="member-sidebar-label">YOUR VIXEN</p>
          <Link className="member-nav-item" href="/member-preview"><span>▦</span> For you</Link>
          <Link className="member-nav-item" href="/creators"><span>⌕</span> Discover creators</Link>
          <Link className="member-nav-item" href="/pricing"><span>◇</span> Memberships</Link>
          <Link className="interaction-sidebar-link" href="/member-preview/sessions" aria-current="page"><span>◉</span> Private video</Link>
          <Link className="member-nav-item" href="/member-preview/messages"><span>✉</span> Messages</Link>
          <Link className="member-nav-item" href="/store"><span>⌑</span> Store</Link>
          <div className="member-sidebar-card"><span className="member-sidebar-spark">✦</span><strong>Your VIXEN account</strong><p>Private video booking will open after accounts and session services are connected.</p><Link href="/sign-up?type=member">Join free <span aria-hidden="true">→</span></Link></div>
          <div className="member-sidebar-foot"><span>Adults 18+ only</span><span>Verified Interactive Xperience &amp; Entertainment Network</span></div>
        </aside>

        <section className="member-main interaction-workspace" aria-labelledby="sessions-heading">
          <header>
            <p className="member-eyebrow"><span /> MEMBER APP · PREVIEW</p>
            <h1 className="interaction-page-title" id="sessions-heading">Private video</h1>
            <p className="interaction-page-intro">Book exclusive one-to-one video time with the creator of your choice, then meet in VIXEN on a supported iPhone, Android phone, or Windows PC browser.</p>
          </header>
          <div className="interaction-status" role="note"><span className="interaction-status-mark" aria-hidden="true">ⓘ</span><span><strong>Booking isn’t active yet.</strong> These are sample profiles. No times can be reserved and no payment or video call will start from this preview.</span></div>
          <div className="interaction-status" role="note"><span className="interaction-status-mark" aria-hidden="true">▣</span><span><strong>Browser-based on your devices.</strong> The planned call works inside VIXEN on supported iPhone, Android, and Windows browsers over HTTPS; no App Store or Play Store download is needed.</span></div>
          <div className="interaction-status" role="note"><span className="interaction-status-mark" aria-hidden="true">◉</span><span><strong>Your camera and microphone stay under your control.</strong> After VIXEN confirms payment, you tap to enter and your browser asks permission. The call starts only if you allow access; you can keep devices off or leave.</span></div>

          <SessionBookingPreview creators={creators} />
        </section>

        <aside className="member-right-rail" aria-label="Session information">
          <section className="member-rail-card"><p className="member-eyebrow">CREATOR CONTROL</p><h2>Clear terms before you book.</h2><p>Each session must show the creator, length, price, availability, cancellation terms, and interaction boundaries before payment.</p></section>
          <section className="member-rail-card member-tier-card"><p className="member-eyebrow">PRIVATE BY DESIGN</p><h2>Meet on VIXEN.</h2><p>A confirmed in-app payment unlocks only that booked session. A creator subscription or VVIP status alone does not unlock a call. Browser camera and microphone permission is requested only when a member chooses to enter the room.</p></section>
          <p className="member-rail-foot">Sample profiles only. Real creator sessions, calendar availability, payments, and video rooms are not connected.</p>
        </aside>
      </div>

      <nav className="member-mobile-nav" aria-label="Member app navigation"><Link href="/member-preview"><span>▦</span>Home</Link><Link href="/creators"><span>⌕</span>Discover</Link><Link href="/member-preview/messages"><span>✉</span>Messages</Link><Link href="/member-preview/sessions" aria-current="page"><span>◉</span>Video</Link></nav>
    </main>
  );
}
