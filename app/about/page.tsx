import Image from "next/image";
import Link from "next/link";
import "./about.css";

export const metadata = {
  title: "About VIXEN",
  description: "Creator freedom on your terms. Join VIXEN free as a member or apply as an adult woman creator.",
};

export default function AboutPage() {
  return (
    <main className="about-vixen">
      <header className="about-header">
        <Link className="about-brand" href="/" aria-label="VIXEN home">
          <Image src="/assets/vixen-mark-3d.png" alt="" width={52} height={52} priority />
          <span>VIXEN</span>
        </Link>
        <nav aria-label="About navigation">
          <Link href="/creators">Discover creators</Link>
          <Link href="/pricing">Memberships</Link>
          <Link className="about-join" href="/sign-up?type=member">Join free <span aria-hidden="true">↗</span></Link>
        </nav>
      </header>

      <section className="about-hero" aria-labelledby="about-title">
        <div className="about-hero-copy">
          <p className="about-kicker">VERIFIED INTERACTIVE XPERIENCE &amp; ENTERTAINMENT NETWORK</p>
          <h1 id="about-title">Creator freedom.<br /><em>On your terms.</em></h1>
          <p className="about-lede">VIXEN brings adult women creators and adult members together in one browser-based space. Members can start free. Creators apply for review before account setup, then approved creators can publish public profile posts.</p>
          <div className="about-actions">
            <Link className="about-primary" href="/creators">Explore creator previews <span aria-hidden="true">→</span></Link>
            <Link className="about-secondary" href="/sign-up?type=creator">Creator account information</Link>
          </div>
          <p className="about-age-note">Adults 18+ only. Free member accounts and creator applications are available. Creator posts are public; paid memberships, stories, paid messages, private video, and payouts are coming soon. Never send identity documents by email or chat.</p>
        </div>
        <figure className="about-mascot">
          <div className="about-mascot-frame">
            <Image src="/assets/nine-tail-fox.png" alt="The Nine Tail Fox emblem, symbol of VIXEN's parent company." width={900} height={900} priority />
          </div>
          <figcaption><span className="about-mascot-mark">✦</span> Nine Tail Fox · Parent company symbol</figcaption>
        </figure>
      </section>

      <section className="about-values" aria-labelledby="about-values-title">
        <div className="about-section-heading">
          <p className="about-kicker">THE VIXEN EXPERIENCE</p>
          <h2 id="about-values-title">A creator platform with <em>clear choices.</em></h2>
          <p>Members can join free. Public creator posts are available; tiered access, paid messages, and private sessions remain upcoming until the complete experience is ready.</p>
        </div>
        <div className="about-value-grid">
          <article><span aria-hidden="true">✦</span><h3>Creator-led</h3><p>Approved creators can shape a public profile and publish updates. Memberships, paid content, messages, and private sessions are planned features.</p></article>
          <article><span aria-hidden="true">◇</span><h3>Clear before checkout</h3><p>When paid access launches, members will see pricing, included access, and boundaries before they choose to pay.</p></article>
          <article><span aria-hidden="true">◉</span><h3>Made for the browser</h3><p>VIXEN is designed to work as a web app on phones and computers, without a separate app-store download.</p></article>
        </div>
      </section>

      <section className="about-family" aria-labelledby="about-family-title">
        <div className="about-family-icon" aria-hidden="true">N</div>
        <div>
          <p className="about-kicker">THE COMPANY FAMILY</p>
          <h2 id="about-family-title">VIXEN is a brand of <em>Nebula Interstellar Networking Economy Limited.</em></h2>
          <p>The Nine Tail Fox represents the parent company. Its original gold artwork sits within VIXEN&apos;s dark visual world, accented with the platform&apos;s neon-pink identity.</p>
        </div>
      </section>

      <footer className="about-footer">
        <Link className="about-brand" href="/"><Image src="/assets/vixen-mark-3d.png" alt="" width={42} height={42} /><span>VIXEN</span></Link>
        <p>Verified Interactive Xperience &amp; Entertainment Network</p>
        <small>Browser-based creator + member web app · Adults 18+ only</small>
      </footer>
    </main>
  );
}
