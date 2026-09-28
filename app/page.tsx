import Link from "next/link";

const creators = [
  { initials: "NL", name: "Nova Luxe", category: "Music · Culture", tone: "draft-rose", tag: "STUDIO NOTES" },
  { initials: "VS", name: "Vee Saint", category: "Style · Behind the scenes", tone: "draft-silver", tag: "THE PROCESS" },
  { initials: "KM", name: "Kira Moss", category: "Art · Studio life", tone: "draft-violet", tag: "NEW WORK" },
];

const features = [
  { icon: "✦", title: "Creator-first tools", text: "A home for your work, your point of view, and the people who follow it." },
  { icon: "◈", title: "Access on your terms", text: "Explore tiered memberships and shape experiences around your community." },
  { icon: "⌁", title: "Closer connections", text: "Make room for direct messages, personal updates, and meaningful moments." },
  { icon: "◇", title: "Exclusive drops", text: "Give your audience a reason to come back for the work only you can make." },
];

const galleryTiles = [
  { symbol: "V", label: "The VIXEN world", tone: "tile-mark" },
  { symbol: "01", label: "Behind the scenes", tone: "tile-portrait tile-one" },
  { symbol: "✦", label: "Creator energy", tone: "tile-glow" },
  { symbol: "V", label: "Your own space", tone: "tile-outline" },
  { symbol: "02", label: "Made for members", tone: "tile-portrait tile-two" },
  { symbol: "↗", label: "Build your brand", tone: "tile-neon" },
];

export default function HomePage() {
  return (
    <main className="draft-home">
      <div className="draft-announcement"><span aria-hidden="true">✦</span> VIXEN — THE CREATOR EXPERIENCE <span className="draft-announcement-soft">· PREVIEW LIVE</span> <span aria-hidden="true">✦</span></div>

      <header className="site-header draft-header">
        <Link className="wordmark draft-wordmark" href="/" aria-label="VIXEN home"><span className="wordmark-v">V</span>IXEN<span className="wordmark-dot">.</span></Link>
        <nav className="main-nav" aria-label="Main navigation">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <Link href="/creators">Creators</Link>
          <a href="#features">Features</a>
        </nav>
        <div className="header-actions"><Link className="button button-small" href="/launch">Explore VIXEN <span aria-hidden="true">↗</span></Link></div>
      </header>

      <section className="draft-hero" id="home">
        <div className="draft-hero-inner">
          <div className="draft-side-index" aria-hidden="true"><span>01</span><i /><i /><i /><i /><i /></div>
          <div className="draft-hero-copy">
            <p className="eyebrow"><span className="eyebrow-line" /> THE ULTIMATE CREATOR PLATFORM</p>
            <h1>VIXEN<span className="draft-hero-star">✦</span></h1>
            <p className="draft-hero-subtitle">BUILT FOR CREATORS. DESIGNED FOR FREEDOM.</p>
            <p className="draft-coming">A NEW WAY TO BUILD <span>IS COMING.</span></p>
            <p className="draft-hero-lede">A premium space. Limitless opportunity.<br />Exclusive content. Real connections.<br />Made for the future you’re creating.</p>
            <div className="hero-actions">
              <Link className="button" href="/creators">Meet the creators <span aria-hidden="true">↗</span></Link>
              <Link className="button button-outline" href="/launch">View launch preview</Link>
            </div>
            <p className="draft-preview-note"><span className="live-dot" /> PREVIEW AVAILABLE · MEMBERSHIPS AND CHECKOUT ARE NOT LIVE</p>
          </div>

          <div className="draft-hero-visual" aria-hidden="true">
            <div className="draft-visual-halo" />
            <div className="draft-visual-rays" />
            <div className="draft-silhouette">
              <div className="draft-hair" />
              <div className="draft-head"><div className="draft-face" /><div className="draft-neck" /></div>
              <div className="draft-shoulder" />
              <div className="draft-shoulder-shine" />
            </div>
            <div className="draft-visual-mark">V<span>X</span></div>
            <div className="draft-visual-caption">OWN YOUR WORLD <span>✦</span> BUILD YOUR EMPIRE</div>
          </div>
          <a className="draft-scroll" href="#about"><span aria-hidden="true" /> SCROLL TO DISCOVER</a>
        </div>
      </section>

      <section className="draft-principles" aria-label="VIXEN principles">
        <div><span>01</span> MADE FOR CREATORS</div><div><span>02</span> BUILT AROUND YOUR WORK</div><div><span>03</span> YOUR BRAND. YOUR RULES.</div><div><span>04</span> COMMUNITY FIRST</div>
      </section>

      <section className="draft-platform section-wrap" id="about">
        <div className="draft-platform-copy">
          <p className="eyebrow">THE PLATFORM</p>
          <h2>Built for creators.<br />Designed for <span>success.</span></h2>
          <p className="draft-body">VIXEN is a creator platform preview shaped around freedom, direct connection, and the tools to build something of your own.</p>
          <div className="draft-feature-list">
            <div><span>✧</span><p><strong>Creator focused</strong><small>Designed around your growth</small></p></div>
            <div><span>◈</span><p><strong>Flexible access</strong><small>Experiences shaped by creators</small></p></div>
            <div><span>⌁</span><p><strong>Direct connection</strong><small>Closer to your community</small></p></div>
            <div><span>◇</span><p><strong>Room to grow</strong><small>Your brand, on your terms</small></p></div>
          </div>
          <Link className="button button-outline" href="/launch">Learn about VIXEN <span aria-hidden="true">↗</span></Link>
        </div>

        <div className="draft-devices" aria-label="Illustrative VIXEN product dashboard">
          <div className="draft-phone draft-phone-left"><div className="draft-screen"><div className="draft-screen-top"><span>VIXEN</span><span>•••</span></div><div className="draft-avatar draft-avatar-small">NL</div><strong>Nova Luxe</strong><small>CREATOR PREVIEW</small><div className="draft-lock-card">✦<span>EXCLUSIVE<br />DROP</span></div><div className="draft-screen-nav">⌂　◉　♡　◌</div></div></div>
          <div className="draft-laptop"><div className="draft-laptop-screen"><div className="draft-browser-bar"><i /><i /><i /><span>vixen · your creator space</span></div><div className="draft-dashboard"><div className="draft-dashboard-heading"><div><small>YOUR CREATOR SPACE</small><strong>Welcome to your empire.</strong></div><span className="draft-dashboard-pill">PREVIEW</span></div><div className="draft-dashboard-banner"><span>VIXEN</span><small>YOUR WORK. YOUR WORLD.</small></div><div className="draft-dashboard-label">DISCOVER CREATORS</div><div className="draft-dashboard-creators">{creators.map((creator) => <div className="draft-dashboard-card" key={creator.initials}><span className={`draft-avatar ${creator.tone}`}>{creator.initials}</span><small>{creator.name}</small></div>)}</div><div className="draft-dashboard-bottom"><span>EXCLUSIVE DROPS</span><span>MEMBERSHIPS</span><span>MESSAGES</span></div></div></div><div className="draft-laptop-base" /></div>
          <div className="draft-phone draft-phone-right"><div className="draft-screen"><div className="draft-screen-top"><span>YOUR STUDIO</span><span>•••</span></div><small>CREATOR TOOLS</small><div className="draft-chart"><i /><i /><i /><i /><i /><i /><i /></div><div className="draft-screen-row"><span>Memberships</span><b>↗</b></div><div className="draft-screen-row"><span>Content drops</span><b>↗</b></div><div className="draft-screen-row"><span>Community</span><b>↗</b></div><div className="draft-screen-nav">⌂　◉　♡　◌</div></div></div>
        </div>
      </section>

      <section className="draft-features" id="features">
        <div className="section-wrap">
          <div className="draft-section-heading"><p className="eyebrow">FOR CREATORS</p><h2>Be seen. Be heard.<br /><span>Be rewarded.</span></h2><p>Build a closer connection with your audience and create on your own terms.</p><Link className="button" href="/creators">Explore creator previews <span aria-hidden="true">↗</span></Link></div>
          <div className="draft-feature-cards">{features.map((feature, index) => <article className="draft-feature-card" key={feature.title}><span className="draft-feature-number">0{index + 1}</span><span className="draft-feature-icon" aria-hidden="true">{feature.icon}</span><h3>{feature.title}</h3><p>{feature.text}</p></article>)}</div>
        </div>
      </section>

      <section className="draft-creators section-wrap">
        <div className="draft-creator-heading"><p className="eyebrow">THE PEOPLE MAKE THE PLATFORM</p><h2>Find your <span>people.</span></h2><p>Meet the voices and makers imagined for the VIXEN creator experience.</p><Link className="arrow-link" href="/creators">Discover creators <span aria-hidden="true">→</span></Link></div>
        <div className="draft-creator-grid">{creators.map((creator) => <Link className="draft-creator-card" href={`/creators/${creator.name.toLowerCase().replaceAll(" ", "-")}`} key={creator.initials}><div className={`draft-creator-image ${creator.tone}`}><span>{creator.initials}</span><i aria-hidden="true">✦</i><small>{creator.tag}</small></div><div className="draft-creator-meta"><strong>{creator.name}</strong><span>{creator.category}</span><b aria-hidden="true">↗</b></div></Link>)}</div>
      </section>

      <section className="draft-toolbelt" aria-label="VIXEN product features">
        <div><span>✦</span><strong>Creator profiles</strong><small>Showcase your world</small></div><div><span>▣</span><strong>Exclusive content</strong><small>Share what you create</small></div><div><span>♧</span><strong>Community</strong><small>Connect with your people</small></div><div><span>◇</span><strong>Flexible access</strong><small>Build your own offers</small></div>
      </section>

      <section className="draft-vip">
        <div className="draft-vip-icon" aria-hidden="true">✉</div>
        <div className="draft-vip-copy"><p className="eyebrow">BE THE FIRST TO KNOW</p><h2>Join the VIXEN <span>VIP list.</span></h2><p>Launch updates and early-access news will appear here when the signup service is connected.</p></div>
        <Link className="button" href="/launch">View launch updates <span aria-hidden="true">↗</span></Link>
      </section>

      <section className="draft-gallery">
        <div className="section-wrap">
          <div className="draft-gallery-heading"><p className="eyebrow">FOLLOW THE MOVEMENT</p><h2>The VIXEN <span>visual world.</span></h2><p>A first look at the tone, tools, and creative energy behind the platform.</p></div>
          <div className="draft-gallery-grid">{galleryTiles.map((tile) => <div className={`draft-gallery-tile ${tile.tone}`} key={tile.label} aria-label={tile.label}><span>{tile.symbol}</span><small>{tile.label}</small></div>)}</div>
          <div className="center-action"><Link className="button button-outline" href="/creators">Explore the creator preview <span aria-hidden="true">↗</span></Link></div>
        </div>
      </section>

      <footer className="site-footer draft-footer">
        <div className="section-wrap draft-footer-main">
          <div className="draft-footer-brand"><Link className="wordmark draft-wordmark" href="/" aria-label="VIXEN home"><span className="wordmark-v">V</span>IXEN<span className="wordmark-dot">.</span></Link><p>POWER. PASSION. PURPOSE.</p><small>This is your time. This is your platform.</small></div>
          <div className="draft-footer-column"><strong>PLATFORM</strong><Link href="/launch">About VIXEN</Link><Link href="/#features">Features</Link><Link href="/pricing">Memberships</Link></div>
          <div className="draft-footer-column"><strong>CREATORS</strong><Link href="/creators">Discover</Link><Link href="/launch">Creator preview</Link><Link href="/launch">Launch updates</Link></div>
          <div className="draft-footer-column"><strong>VIXEN</strong><Link href="/launch">Launch preview</Link><Link href="/#about">About</Link><Link href="/">Home</Link></div>
        </div>
        <div className="draft-footer-bottom"><span>© {new Date().getFullYear()} VIXEN. Preview build.</span><span>MEMBERSHIP AND PAYMENT SERVICES ARE NOT LIVE.</span></div>
      </footer>
    </main>
  );
}
