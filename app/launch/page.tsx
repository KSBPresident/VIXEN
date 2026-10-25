import Image from "next/image";
import Link from "next/link";
import { LaunchCountdown } from "@/components/launch-countdown";

const launchPrinciples = [
  { number: "01", title: "Your access. Your tiers.", body: "Shape memberships around the work you make and the community you lead." },
  { number: "02", title: "Messages with value.", body: "Create direct, paid experiences while keeping your boundaries in your hands." },
  { number: "03", title: "Drops worth waiting for.", body: "Give your community a reason to come back for work only you can make." },
  { number: "04", title: "Your brand. Your rules.", body: "Build your creator presence and grow on your own terms." },
];

export const metadata = {
  title: "VIXEN official launch",
  description: "VIXEN beta ends Monday night, November 2. Official launch begins Tuesday, November 3, 2026 at 12:00 a.m. Trinidad and Tobago time.",
};

export default function LaunchPage() {
  return (
    <main>
      <header className="site-header">
        <Link className="vixen-subpage-logo" href="/" aria-label="VIXEN home"><Image src="/assets/vixen-mark-3d.png" alt="" width={120} height={120} /></Link>
        <nav className="main-nav" aria-label="Main navigation">
          <Link href="/">Home</Link>
          <Link href="/creators">Discover</Link>
          <Link href="/store">Store</Link>
          <Link href="/pricing">Memberships</Link>
        </nav>
        <div className="header-actions"><Link className="button button-small" href="/#experience">Explore VIXEN <span aria-hidden="true">↗</span></Link></div>
      </header>

      <section className="section-wrap" style={{ paddingTop: 22, paddingBottom: 0 }}>
        <LaunchCountdown />
      </section>

      <section className="subpage-hero">
        <div className="section-wrap">
          <p className="eyebrow">BETA SOFT LAUNCH · OFFICIAL LAUNCH NOVEMBER 3</p>
          <h1>Control your <span>power.</span></h1>
          <p>Explore the VIXEN browser app during beta. Free member accounts and creator applications are available; paid services and creator publishing remain marked Coming soon until fully ready.</p>
          <div className="hero-actions" style={{ justifyContent: "center", marginTop: 28 }}>
            <Link className="button" href="/creators">Open creator directory <span aria-hidden="true">↗</span></Link>
            <Link className="button button-outline" href="/#experience">See the experience</Link>
          </div>
        </div>
      </section>

      <section className="section-wrap section-block" style={{ paddingTop: 52 }}>
        <div className="section-heading">
          <p className="eyebrow">EXCLUSIVE. POWERFUL. CREATOR FIRST.</p>
          <h2>Your content.<br /><span>Your rules.</span></h2>
          <p>VIXEN gives creators a vision for tiered access, meaningful direct connections, and exclusive releases in one branded home.</p>
        </div>
        <div className="benefit-grid">
          {launchPrinciples.map((item) => (
            <article className="benefit-card" key={item.number}>
              <span className="card-number">{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
              <span className="card-glow" aria-hidden="true" />
            </article>
          ))}
        </div>
      </section>

      <section className="section-wrap mascot-story" aria-labelledby="mascot-story-title">
        <div className="mascot-story-art">
          <Image src="/assets/nine-tail-fox.png" alt="The official black and gold nine-tail fox mascot" width={520} height={520} />
        </div>
        <div className="mascot-story-copy">
          <p className="eyebrow">THE VIXEN MASCOT</p>
          <h2 id="mascot-story-title">The fox is part of our <span>identity.</span></h2>
          <p>VIXEN’s official mascot is a fox. The nine-tail fox shown here is also a symbol of our parent company, Nebula Interstellar Networking Economy Limited.</p>
          <p className="mascot-story-company">VIXEN · Verified Interactive Xperience &amp; Entertainment Network</p>
        </div>
      </section>

      <section className="join-section">
        <div className="join-inner">
          <p className="eyebrow">BUILT FOR CREATORS. DESIGNED FOR FREEDOM.</p>
          <h2>Your next chapter <span>starts here.</span></h2>
          <p>The beta ends Monday night, November 2. Official launch begins Tuesday, November 3 at midnight AST, with a one-week creator commission discount. Paid memberships, publishing, messaging, private video, coins, store checkout, and VIP/VVIP entry remain Coming soon until complete.</p>
          <Link className="button button-light" href="/creators">Browse creator directory <span aria-hidden="true">↗</span></Link>
          <p style={{ fontSize: 11, marginTop: 20 }}>Explore the VIXEN experience and see how creator communities, memberships, and exclusive content can come together.</p>
        </div>
      </section>

      <footer className="site-footer">
        <div className="section-wrap footer-inner">
          <Link className="vixen-subpage-logo" href="/" aria-label="VIXEN home"><Image src="/assets/vixen-mark-3d.png" alt="" width={120} height={120} /></Link>
          <p>Exclusive. Powerful. Profitable.</p>
          <div className="footer-links"><Link href="/creators">Creators</Link><Link href="/store">Store</Link><Link href="/pricing">Memberships</Link><Link href="/">Home</Link></div>
          <small>© {new Date().getFullYear()} VIXEN. Public web app preview. <span className="company-name">Verified Interactive Xperience &amp; Entertainment Network</span></small>
        </div>
      </footer>
    </main>
  );
}
