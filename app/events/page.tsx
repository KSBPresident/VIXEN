import Image from "next/image";
import Link from "next/link";
import "./events.css";

export const metadata = {
  title: "Private member experiences",
  description: "Preview planned VIXEN private events for age-verified members aged 21 and over.",
};

export default function EventsPreviewPage() {
  return (
    <main className="events-app">
      <header className="events-topbar">
        <Link className="events-brand" href="/" aria-label="VIXEN home">
          <Image src="/assets/vixen-mark-3d.png" alt="" width={62} height={62} priority />
          <span>VIXEN</span>
        </Link>
        <nav className="events-nav" aria-label="Main navigation">
          <Link href="/creators">Discover</Link>
          <Link href="/events" aria-current="page">Experiences</Link>
          <Link href="/pricing">Memberships</Link>
          <Link href="/store">Store</Link>
        </nav>
        <Link className="events-account-link" href="/sign-up?type=member">Join VIXEN <span aria-hidden="true">↗</span></Link>
      </header>

      <section className="events-hero">
        <div className="events-hero-copy">
          <p className="events-eyebrow"><span /> PRIVATE MEMBER EXPERIENCES · 21+</p>
          <h1>Meet in person.<br /><em>On clear terms.</em></h1>
          <p>VIXEN is planning private, members-only events where eligible adults may meet participating creators at scheduled experiences. This is a preview, not an invitation or event listing.</p>
          <div className="events-hero-actions">
            <Link className="events-primary-link" href="/pricing#private-club-heading">Compare VIP and VVIP <span aria-hidden="true">→</span></Link>
            <Link className="events-secondary-link" href="/sign-up?type=member">Create a free member account</Link>
          </div>
        </div>
        <aside className="events-access-card" aria-label="Age and entry requirements">
          <p className="events-eyebrow">ENTRY REQUIREMENTS</p>
          <strong>21<span>+</span></strong>
          <p>Age and identity verification required for VIP/VVIP event eligibility.</p>
          <div><span aria-hidden="true">▣</span><p><b>Active membership card required.</b><br />No card, no entry.</p></div>
        </aside>
      </section>

      <section className="events-notice section-wrap" role="note">
        <span aria-hidden="true">ⓘ</span>
        <p><strong>Planned, not active.</strong> No events are scheduled, no memberships are being sold, and no entry requests or payments can be made from this page.</p>
      </section>

      <section className="section-wrap events-requirements" aria-labelledby="events-requirements-title">
        <header>
          <p className="events-eyebrow">BEFORE YOU REQUEST ENTRY</p>
          <h2 id="events-requirements-title">Know the rules up front.</h2>
          <p>VIP and VVIP are separate from free member accounts and creator subscriptions. Event admission, ticket costs, venue, and guest rules will be shown before any request opens.</p>
        </header>
        <div className="events-rule-grid">
          <article><span>01</span><h3>Adults 21 and over</h3><p>Private-event eligibility requires age and identity verification. An account declaration alone is not enough.</p></article>
          <article><span>02</span><h3>Bring your active card</h3><p>Every guest must present their own valid VIP or VVIP membership card at check-in. No card means no entry.</p></article>
          <article><span>03</span><h3>Request access; await approval</h3><p>Membership does not guarantee a place. Capacity, event-specific eligibility, and any additional charges will be disclosed first.</p></article>
          <article><span>04</span><h3>Creators choose to attend</h3><p>Creator attendance is opt-in for each event. A membership never guarantees access to or time with a particular creator.</p></article>
        </div>
      </section>

      <section className="section-wrap events-sample" aria-labelledby="events-sample-title">
        <div className="events-sample-heading">
          <div><p className="events-eyebrow">EVENTS CALENDAR</p><h2 id="events-sample-title">When plans are ready.</h2></div>
          <span className="events-status-pill">NO EVENTS SCHEDULED</span>
        </div>
        <article className="events-sample-card">
          <div className="events-sample-art" aria-hidden="true"><span>V</span><i>✦</i></div>
          <div className="events-sample-copy">
            <p className="events-eyebrow">ILLUSTRATIVE EVENT CARD</p>
            <h3>Private creator experience</h3>
            <p>Event details will be published only after the venue, hosts, access rules, and participant boundaries are confirmed.</p>
            <div className="events-sample-meta"><span>Date <b>Not scheduled</b></span><span>Entry <b>VIP / VVIP card</b></span><span>Age <b>21+ verified</b></span></div>
            <button type="button" disabled aria-disabled="true">Requests are not open</button>
          </div>
        </article>
      </section>

      <section className="section-wrap events-consent" aria-labelledby="events-consent-title">
        <div><p className="events-eyebrow">CONSENT AND SAFETY</p><h2 id="events-consent-title">Membership is never consent.</h2></div>
        <ul>
          <li>Every attendee must follow the event’s published conduct, privacy, and safety rules.</li>
          <li>Everyone controls their own boundaries and may decline or leave an interaction at any time.</li>
          <li>Membership or an event pass never grants permission to contact, photograph, record, touch, or engage with another person.</li>
          <li>Creators and guests choose their own participation. No one owes a meeting, conversation, or physical interaction.</li>
        </ul>
      </section>

      <section className="section-wrap events-vvip" aria-labelledby="events-vvip-title">
        <div><p className="events-eyebrow">VVIP STATUS · PLANNED</p><h2 id="events-vvip-title">Your ID, your account.</h2><p>VVIP members will be able to redeem an issued VVIP ID while signed in. After secure verification, eligible accounts receive complimentary VIXEN Elite status. The redemption flow is not active, and an ID cannot be self-issued or reused across accounts.</p></div>
        <Link href="/pricing">Review membership access <span aria-hidden="true">→</span></Link>
      </section>

      <footer className="events-footer"><div className="section-wrap"><Link href="/">VIXEN</Link><p>Exclusive. Powerful. Profitable.</p><div><Link href="/creators">Discover</Link><Link href="/pricing">Memberships</Link><Link href="/store">Store</Link><Link href="/about">About VIXEN</Link></div><small>© {new Date().getFullYear()} VIXEN · Preview only · <span className="company-name">Verified Interactive Xperience &amp; Entertainment Network</span></small></div></footer>
    </main>
  );
}
