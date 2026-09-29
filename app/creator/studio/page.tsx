import Image from "next/image";
import Link from "next/link";
import "./studio.css";

export const metadata = {
  title: "Creator studio preview",
  description: "Preview the VIXEN creator workspace for adult women creators.",
  robots: { index: false, follow: false },
};

const workspaceAreas = [
  { icon: "◈", title: "Profile", copy: "Shape your public creator page and tell members what you make.", href: "/sign-up?type=creator", action: "Creator account information" },
  { icon: "▧", title: "Content & drops", copy: "Plan posts and exclusive drops with clear access boundaries.", href: "/sign-up?type=creator", action: "Onboarding preview" },
  { icon: "◇", title: "Memberships", copy: "See how creator-set prices and included benefits are explained.", href: "/pricing", action: "Review the pricing model" },
  { icon: "✉", title: "Messages", copy: "Preview member conversations and planned paid-message controls.", href: "/member-preview/messages", action: "Open messages preview" },
  { icon: "◉", title: "Private video", copy: "Preview creator-controlled, paid browser-session flows.", href: "/member-preview/sessions", action: "Open session preview" },
  { icon: "↗", title: "Earnings & payouts", copy: "Revenue, fees, payout timing, and statements are not available yet.", href: "/pricing", action: "See what is still planned" },
];

export default function CreatorStudioPreviewPage() {
  return (
    <main className="creator-studio-app">
      <header className="studio-topbar">
        <Link href="/" className="studio-brand" aria-label="VIXEN home">
          <Image src="/assets/vixen-mark-3d.png" alt="" width={62} height={62} priority />
          <span>VIXEN</span>
        </Link>
        <nav className="studio-top-links" aria-label="Creator workspace">
          <Link href="/creators">Discover</Link>
          <Link href="/pricing">Memberships</Link>
          <Link href="/store">Store</Link>
        </nav>
        <div className="studio-account-actions"><span><i /> PREVIEW</span><Link href="/sign-up?type=creator">Creator sign-up info <b aria-hidden="true">↗</b></Link></div>
      </header>

      <div className="studio-shell">
        <aside className="studio-sidebar" aria-label="Creator workspace navigation">
          <p className="studio-nav-label">CREATOR SPACE</p>
          <Link className="studio-nav-link is-active" href="/creator/studio"><span aria-hidden="true">▦</span> Overview</Link>
          <Link className="studio-nav-link" href="/sign-up?type=creator"><span aria-hidden="true">◉</span> My profile</Link>
          <Link className="studio-nav-link" href="/sign-up?type=creator"><span aria-hidden="true">▧</span> Content &amp; drops</Link>
          <Link className="studio-nav-link" href="/pricing"><span aria-hidden="true">◇</span> Memberships</Link>
          <Link className="studio-nav-link" href="/member-preview/messages"><span aria-hidden="true">✉</span> Messages <small>Preview</small></Link>
          <Link className="studio-nav-link" href="/member-preview/sessions"><span aria-hidden="true">◉</span> Private video <small>Preview</small></Link>
          <div className="studio-sidebar-note"><span aria-hidden="true">✦</span><strong>Your work. Your terms.</strong><p>Creators choose what to publish, what to charge, and which sessions to offer.</p></div>
          <div className="studio-sidebar-foot"><span>Adult women creators · 18+</span><span>VIXEN creator workspace preview</span></div>
        </aside>

        <section className="studio-main" aria-labelledby="studio-heading">
          <div className="studio-welcome">
            <div>
              <p className="studio-eyebrow"><i /> CREATOR WORKSPACE · PREVIEW</p>
              <h1 id="studio-heading">Create on<br /><em>your terms.</em></h1>
              <p>A first look at the tools planned for adult women creators: your profile, your content, your memberships, and your audience.</p>
              <Link className="studio-primary-link" href="/sign-up?type=creator">Creator account details <span aria-hidden="true">↗</span></Link>
            </div>
            <div className="studio-welcome-mark" aria-hidden="true"><span>V</span><i>✦</i><b>VIXEN STUDIO</b></div>
          </div>

          <div className="studio-preview-notice" role="note"><span aria-hidden="true">ⓘ</span><p><strong>This workspace is a preview.</strong> No creator accounts, profile edits, uploads, memberships, messages, earnings, or payouts are active. Sample controls do not save or publish information.</p></div>

          <div className="studio-section-heading"><div><p className="studio-eyebrow">YOUR WORKSPACE</p><h2>Build your presence.</h2></div><span>All features shown are previews</span></div>

          <div className="studio-area-grid">
            {workspaceAreas.map((area) => (
              <article className="studio-area-card" key={area.title}>
                <span className="studio-area-icon" aria-hidden="true">{area.icon}</span>
                <p className="studio-area-state">PLANNED</p>
                <h3>{area.title}</h3>
                <p>{area.copy}</p>
                <Link href={area.href}>{area.action} <span aria-hidden="true">→</span></Link>
              </article>
            ))}
          </div>

          <section className="studio-activity" aria-labelledby="studio-activity-heading">
            <div><p className="studio-eyebrow">RECENT ACTIVITY</p><h2 id="studio-activity-heading">Your updates will live here.</h2></div>
            <p>No activity is shown because this is a sample workspace. Connect creator accounts and publishing tools only after VIXEN’s website experience is ready.</p>
          </section>
        </section>

        <aside className="studio-right-rail" aria-label="Creator onboarding and account information">
          <section className="studio-rail-card studio-ready-card">
            <p className="studio-eyebrow">GETTING STARTED</p>
            <h2>A clear path to launch.</h2>
            <ol>
              <li><span>01</span><div><strong>Create a creator account</strong><small>VIXEN account signup is not active yet.</small></div></li>
              <li><span>02</span><div><strong>Verify age and identity</strong><small>Eligibility and creator checks are required.</small></div></li>
              <li><span>03</span><div><strong>Set your boundaries</strong><small>Disclose benefits, prices, and paid extras.</small></div></li>
              <li><span>04</span><div><strong>Publish when approved</strong><small>Creator tools and payouts are planned.</small></div></li>
            </ol>
            <Link href="/sign-up?type=creator">Creator account information <span aria-hidden="true">→</span></Link>
          </section>

          <section className="studio-rail-card">
            <p className="studio-eyebrow">CREATOR CONTROL</p>
            <h2>Your account. Your permissions.</h2>
            <p>Creator access must be verified and enforced by VIXEN. A sample screen or sign-up choice does not grant publishing, manager, or payout privileges.</p>
          </section>

          <section className="studio-rail-card studio-support-card">
            <p className="studio-eyebrow">MEMBER VIEW</p>
            <h2>See the other side.</h2>
            <p>Explore the member app preview to see how people browse creator updates and understand membership access.</p>
            <Link href="/member-preview">Open member preview <span aria-hidden="true">→</span></Link>
          </section>
        </aside>
      </div>

      <nav className="studio-mobile-nav" aria-label="Creator workspace navigation"><Link href="/creator/studio" aria-current="page"><span>▦</span>Home</Link><Link href="/creators"><span>⌕</span>Discover</Link><Link href="/pricing"><span>◇</span>Plans</Link><Link href="/sign-up?type=creator"><span>＋</span>Join</Link></nav>
    </main>
  );
}
