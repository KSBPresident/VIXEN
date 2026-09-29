import Image from "next/image";
import Link from "next/link";
import "./member-preview.css";
import "./member-interactions.css";

export const metadata = {
  title: "Member app preview",
  description: "Preview the VIXEN member experience for adults 18+.",
  robots: { index: false, follow: false },
};

const creators = [
  { initials: "NL", name: "Nova Luxe", handle: "@nova.luxe", category: "Music · Culture", slug: "nova-luxe", tone: "rose", title: "Studio after dark", detail: "A sample creator update from the VIXEN preview." },
  { initials: "VS", name: "Vee Saint", handle: "@vee.saint", category: "Style · Behind the scenes", slug: "vee-saint", tone: "silver", title: "New set, first look", detail: "A sample locked post. Membership access is not active." },
  { initials: "KM", name: "Kira Moss", handle: "@kira.moss", category: "Art · Studio life", slug: "kira-moss", tone: "violet", title: "Making something new", detail: "A sample creator update from the VIXEN preview." },
];

export default function MemberPreviewPage() {
  return (
    <main className="member-app">
      <header className="member-topbar">
        <Link href="/" className="member-brand" aria-label="VIXEN home">
          <Image src="/assets/vixen-mark-3d.png" alt="" width={62} height={62} priority />
          <span>VIXEN</span>
        </Link>
        <div className="member-search"><span aria-hidden="true">⌕</span><span>Search creators and interests</span><kbd>⌘ K</kbd></div>
        <div className="member-top-actions"><span className="member-preview-pill"><i /> PREVIEW</span><Link href="/sign-up?type=member">Create free account <b aria-hidden="true">↗</b></Link></div>
      </header>

      <div className="member-shell">
        <aside className="member-sidebar" aria-label="Member app navigation">
          <p className="member-sidebar-label">YOUR VIXEN</p>
          <Link className="member-nav-item is-active" href="/member-preview"><span>▦</span> For you</Link>
          <Link className="member-nav-item" href="/creators"><span>⌕</span> Discover creators</Link>
          <Link className="member-nav-item" href="/pricing"><span>◇</span> Memberships</Link>
          <Link className="member-nav-item" href="/store"><span>⌑</span> Store</Link>
          <Link className="member-nav-item" href="/member-preview/messages"><span>✉</span> Messages <small>Preview</small></Link>
          <Link className="member-nav-item" href="/member-preview/sessions"><span>◉</span> Private video <small>Preview</small></Link>
          <div className="member-nav-disabled"><span>▣</span> My library <small>Coming soon</small></div>
          <div className="member-sidebar-card"><span className="member-sidebar-spark">✦</span><strong>Your VIXEN account</strong><p>Follow creators and choose a membership when you’re ready.</p><Link href="/sign-up?type=member">Join free <span aria-hidden="true">→</span></Link></div>
          <div className="member-sidebar-foot"><span>Adults 18+ only</span><span>Verified Interactive Xperience &amp; Entertainment Network</span></div>
        </aside>

        <section className="member-main" aria-labelledby="member-heading">
          <div className="member-welcome">
            <div><p className="member-eyebrow"><span /> THE MEMBER EXPERIENCE · PREVIEW</p><h1 id="member-heading">Your world.<br /><em>Your way.</em></h1><p>Discover women creators, explore their work, and see what a VIXEN membership can offer.</p></div>
            <div className="member-welcome-art" aria-hidden="true"><span>V</span><i>✦</i><b>VIXEN</b></div>
          </div>

          <div className="member-notice"><span aria-hidden="true">ⓘ</span><p><strong>This is a visual preview.</strong> These sample profiles and posts are illustrative. Real accounts, creator posts, messages, subscriptions, and checkout are not active yet.</p><Link href="/sign-up?type=member">About sign-up <span aria-hidden="true">→</span></Link></div>

          <div className="member-feed-heading"><div><p className="member-eyebrow">A FIRST LOOK</p><h2>Creator updates</h2></div><Link href="/creators">Discover all <span aria-hidden="true">→</span></Link></div>

          <div className="member-post-list">
            {creators.map((creator, index) => (
              <article className="member-post" key={creator.slug}>
                <div className="member-post-header"><div className={`member-avatar ${creator.tone}`}>{creator.initials}</div><div className="member-post-author"><Link href={`/creators/${creator.slug}`}>{creator.name} <span className="member-verified" aria-label="Sample profile">✦</span></Link><small>{creator.handle} · Sample profile</small></div><Link className="member-more" href={`/creators/${creator.slug}`} aria-label={`View ${creator.name} profile`}>•••</Link></div>
                <Link className={`member-post-art member-art-${creator.tone}`} href={`/creators/${creator.slug}`} aria-label={`Open ${creator.name} sample post`}><span className="member-art-number">0{index + 1}</span><span className="member-art-orbit" /><span className="member-art-monogram">{creator.initials}</span><span className="member-art-caption">VIXEN CREATOR PREVIEW</span>{index === 1 && <span className="member-lock">◇ <small>MEMBERS ONLY PREVIEW</small></span>}</Link>
                <div className="member-post-body"><div><p className="member-post-category">{creator.category}</p><h3>{creator.title}</h3><p>{creator.detail}</p></div><Link className="member-post-open" href={`/creators/${creator.slug}`}>View profile <span aria-hidden="true">↗</span></Link></div>
                <div className="member-post-footer"><span>♡ <small>Follow</small></span><span>◌ <small>Creator preview</small></span><Link href="/pricing">See membership options <span aria-hidden="true">→</span></Link></div>
              </article>
            ))}
          </div>

          <div className="member-bottom-cta"><div><p className="member-eyebrow">READY WHEN YOU ARE</p><h2>Start with a free member account.</h2><p>Members are adults 18+ of any gender. Creator accounts are separate and intended for adult women creators.</p></div><Link className="member-primary-button" href="/sign-up?type=member">Create a free account <span aria-hidden="true">↗</span></Link></div>
        </section>

        <aside className="member-right-rail" aria-label="Membership and discovery">
          <section className="member-rail-card member-join-card"><p className="member-eyebrow">MEMBER ACCESS</p><h2>Join for free.<br /><em>Choose what’s next.</em></h2><p>Browse creator previews first. Decide on a creator membership only when its price and access are clear.</p><Link href="/sign-up?type=member">Create your account <span aria-hidden="true">→</span></Link></section>
          <section className="member-rail-section"><div className="member-rail-heading"><h2>Explore creators</h2><Link href="/creators">All <span aria-hidden="true">→</span></Link></div>{creators.map((creator) => <Link className="member-creator-mini" href={`/creators/${creator.slug}`} key={creator.slug}><span className={`member-avatar ${creator.tone}`}>{creator.initials}</span><span><strong>{creator.name}</strong><small>{creator.category}</small></span><b aria-hidden="true">↗</b></Link>)}</section>
          <section className="member-rail-card member-tier-card"><p className="member-eyebrow">CLEAR MEMBERSHIPS</p><h2>Know what’s included.</h2><p>Creator memberships are priced per creator. Review the access and limits before subscribing.</p><Link href="/pricing">See packages and boundaries <span aria-hidden="true">→</span></Link></section>
          <section className="member-rail-card member-tier-card"><p className="member-eyebrow">MEMBER TOOLS</p><h2>Talk or meet.</h2><p>Preview the planned in-app messages and private video sessions. Sample screens only; these services are not active.</p><Link href="/member-preview/messages">Messages preview <span aria-hidden="true">→</span></Link><br /><Link href="/member-preview/sessions">Private video preview <span aria-hidden="true">→</span></Link></section>
          <section className="member-rail-card member-nine-card"><span className="member-nine-mark">9</span><div><p className="member-eyebrow">NINE COIN · UPCOMING</p><h2>33⅓% subscription benefit</h2><p>Planned for eligible creator subscriptions. Not redeemable yet.</p><Link href="/pricing">Offer details <span aria-hidden="true">→</span></Link></div></section>
          <p className="member-rail-foot">VIXEN is designed for adult audiences (18+) and adult women creators. Sample profiles are not real creator accounts.</p>
        </aside>
      </div>
      <nav className="member-mobile-nav" aria-label="Mobile app navigation"><Link href="/member-preview" aria-current="page"><span>▦</span>Home</Link><Link href="/creators"><span>⌕</span>Discover</Link><Link href="/pricing"><span>◇</span>Plans</Link><Link href="/store"><span>⌑</span>Store</Link></nav>
    </main>
  );
}
