import Image from "next/image";
import Link from "next/link";
export default function HomePage() {
  return (
    <main className="vixen-home">
      <header className="vixen-topbar">
        <Link className="vixen-header-brand" href="/" aria-label="VIXEN home">
          <Image src="/assets/vixen-mark-3d.png" alt="VIXEN emblem" width={240} height={240} priority />
        </Link>
        <nav className="vixen-nav" aria-label="Main navigation">
          <Link href="/creators">Discover</Link>
          <Link href="/store" aria-label="Shop intimate wellness">Store</Link>
          <Link href="/pricing">Memberships</Link>
          <Link href="/about">About</Link>
        </nav>
        <Link className="vixen-header-cta" href="/sign-up">Create account <span aria-hidden="true">↗</span></Link>
      </header>

      <section className="vixen-entry">
        <div className="vixen-entry-copy">
          <p className="vixen-kicker"><span aria-hidden="true" /> CARIBBEAN ADULT CREATOR PLATFORM · 18+</p>
          <Image className="vixen-hero-logo" src="/assets/vixen-logo-3d.png" alt="VIXEN" width={640} height={728} priority />
          <h1 className="visually-hidden">VIXEN — your creative world, your rules</h1>
          <p className="vixen-entry-tagline">Your audience. Your content.<br /><span>Your terms.</span></p>
          <p className="vixen-entry-description">A Caribbean-first home where adult women creators share content and earn from memberships, exclusive drops, and paid messages—with an easy way for adult fans to join and watch.</p>
          <Link className="vixen-discover-link" href="/member-preview">See the member app preview <span aria-hidden="true">→</span></Link>
        </div>

        <section className="vixen-auth-card" aria-labelledby="vixen-auth-heading">
          <div className="vixen-auth-card-heading">
            <p className="vixen-kicker">18+ · CHOOSE YOUR ACCOUNT</p>
            <h2 id="vixen-auth-heading">Here to watch or create?</h2>
            <p>Member accounts are for adult viewers of any gender. Creator accounts are separate and intended for adult women creators.</p>
          </div>
          <div className="account-path-grid" role="group" aria-label="Choose an account type">
            <Link className="account-path-card" href="/sign-up?type=member">
              <span className="vixen-kicker">MEMBER</span>
              <strong>Join to watch</strong>
              <span>Follow creators and choose memberships or paid content.</span>
              <b>Create a free account <span aria-hidden="true">↗</span></b>
            </Link>
            <Link className="account-path-card" href="/sign-up?type=creator">
              <span className="vixen-kicker">CREATOR</span>
              <strong>Publish and earn</strong>
              <span>Build an audience, offer memberships, and share exclusive content.</span>
              <b>Creator account info <span aria-hidden="true">↗</span></b>
            </Link>
          </div>
          <p className="vixen-auth-caption">Adults 18+ only. Member sign-up is a preview; creator onboarding is not active yet.</p>
        </section>
      </section>

      <section className="vixen-value-strip" aria-label="The VIXEN experience">
        <div><span aria-hidden="true">✦</span><strong>Creator-led</strong></div>
        <div><span aria-hidden="true">◈</span><strong>Made for community</strong></div>
        <div><span aria-hidden="true">⌁</span><strong>Built around your voice</strong></div>
      </section>

      <footer className="vixen-footer">
        <Link href="/" className="vixen-footer-brand"><Image src="/assets/vixen-mark-3d.png" alt="" width={160} height={160} /> <span>Creator-first. Always.</span></Link>
        <div className="vixen-footer-links"><Link href="/creators">Discover</Link><Link href="/store">Store</Link><Link href="/pricing">Memberships</Link><Link href="/about">About VIXEN</Link></div>
        <small>© {new Date().getFullYear()} VIXEN <span className="company-name">Verified Interactive Xperience &amp; Entertainment Network</span></small>
      </footer>
    </main>
  );
}
