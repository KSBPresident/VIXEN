import Image from "next/image";
import Link from "next/link";
import { SocialSignUp } from "@/components/auth/social-sign-up";

const supabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
);

export default function HomePage() {
  return (
    <main className="vixen-home">
      <header className="vixen-topbar">
        <Link className="vixen-header-brand" href="/" aria-label="VIXEN home">
          <Image src="/assets/vixen-logo-3d.png" alt="VIXEN" width={240} height={273} priority />
        </Link>
        <nav className="vixen-nav" aria-label="Main navigation">
          <Link href="/creators">Discover</Link>
          <Link href="/pricing">Memberships</Link>
        </nav>
        <Link className="vixen-header-cta" href="/sign-up">Create account <span aria-hidden="true">↗</span></Link>
      </header>

      <section className="vixen-entry">
        <div className="vixen-entry-copy">
          <p className="vixen-kicker"><span aria-hidden="true" /> THE CREATOR PLATFORM</p>
          <Image className="vixen-hero-logo" src="/assets/vixen-logo-3d.png" alt="VIXEN" width={640} height={728} priority />
          <h1 className="visually-hidden">VIXEN — your creative world, your rules</h1>
          <p className="vixen-entry-tagline">Your audience. Your content.<br /><span>Your terms.</span></p>
          <p className="vixen-entry-description">A home for creators to share their work, connect with their community, and build on their own terms.</p>
          <Link className="vixen-discover-link" href="/creators">Explore the creator preview <span aria-hidden="true">→</span></Link>
        </div>

        <section className="vixen-auth-card" aria-labelledby="vixen-auth-heading">
          <div className="vixen-auth-card-heading">
            <p className="vixen-kicker">JOIN VIXEN</p>
            <h2 id="vixen-auth-heading">Create your account</h2>
            <p>Sign up securely with your preferred account.</p>
          </div>
          <SocialSignUp configured={supabaseConfigured} />
          <p className="vixen-auth-caption">Your sign-in stays with the provider you choose.</p>
        </section>
      </section>

      <section className="vixen-value-strip" aria-label="The VIXEN experience">
        <div><span aria-hidden="true">✦</span><strong>Creator-led</strong></div>
        <div><span aria-hidden="true">◈</span><strong>Made for community</strong></div>
        <div><span aria-hidden="true">⌁</span><strong>Built around your voice</strong></div>
      </section>

      <footer className="vixen-footer">
        <Link href="/" className="vixen-footer-brand"><Image src="/assets/vixen-logo-3d.png" alt="" width={160} height={182} /> <span>Creator-first. Always.</span></Link>
        <div className="vixen-footer-links"><Link href="/creators">Discover</Link><Link href="/pricing">Memberships</Link><Link href="/launch">About VIXEN</Link></div>
        <small>© {new Date().getFullYear()} VIXEN</small>
      </footer>
    </main>
  );
}
