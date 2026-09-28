import Link from "next/link";

const benefits = [
  { number: "01", title: "Your access. Your tiers.", body: "Build memberships around the work you make and the community you lead." },
  { number: "02", title: "Messages with value.", body: "Create direct, paid experiences while keeping your boundaries in your hands." },
  { number: "03", title: "Drops worth waiting for.", body: "Give your community a reason to come back for the work only you can make." },
  { number: "04", title: "Your brand, your rules.", body: "Shape your creator presence and grow on your own terms." },
];

const tiers = [
  { name: "Bronze", price: "$9.99", detail: "A first look inside" },
  { name: "Silver", price: "$19.99", detail: "Closer to the creator" },
  { name: "Gold", price: "$29.99", detail: "More access, more value" },
  { name: "Elite", price: "$49.99", detail: "The full experience" },
];

const creators = [
  { initials: "NL", name: "Nova Luxe", category: "Music · Culture", tone: "portrait-rose" },
  { initials: "VS", name: "Vee Saint", category: "Style · Behind the scenes", tone: "portrait-silver" },
  { initials: "KM", name: "Kira Moss", category: "Art · Studio life", tone: "portrait-violet" },
];

export default function HomePage() {
  return (
    <main>
      <header className="site-header">
        <Link className="wordmark" href="/" aria-label="VIXEN home"><span className="wordmark-v">V</span>IXEN<span className="wordmark-dot">.</span></Link>
        <nav className="main-nav" aria-label="Main navigation">
          <Link href="/creators">Discover</Link>
          <a href="#experience">The experience</a>
          <Link href="/pricing">Memberships</Link>
        </nav>
        <div className="header-actions"><Link className="text-link" href="/launch">Launch preview</Link><Link className="button button-small" href="/pricing">Join the Elite <span aria-hidden="true">↗</span></Link></div>
      </header>

      <section className="hero section-wrap">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-line" /> BUILT FOR CREATORS. DESIGNED FOR FREEDOM.</p>
          <h1>Your content.<br />Your rules.<br /><span>Your empire.</span></h1>
          <p className="hero-lede">A creator-first platform for the work you make, the people who believe in it, and the future you build together.</p>
          <div className="hero-actions"><Link className="button" href="/creators">Discover VIXEN <span aria-hidden="true">↗</span></Link><Link className="button button-outline" href="/pricing">See memberships</Link></div>
          <p className="hero-note"><span className="live-dot" /> Built for creators. By creators.</p>
        </div>
        <div className="hero-art" aria-label="VIXEN creator platform preview">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <div className="hero-v">V<span>X</span></div>
          <div className="preview-card preview-card-left"><span className="mini-label">CREATOR CONTROL</span><strong>YOUR BRAND<br />YOUR RULES</strong><span className="mini-line" /></div>
          <div className="preview-card preview-card-right"><span className="mini-label">MEMBERSHIP</span><strong>ELITE<br /><span>$49.99 / MO</span></strong><span className="mini-lock">✦</span></div>
          <div className="hero-stamp"><span>V</span><small>CREATOR<br />POWER</small></div>
          <p className="art-caption">THE NEXT EVOLUTION OF CREATOR PLATFORMS</p>
        </div>
      </section>

      <section className="signal-bar" aria-label="Platform principles"><div><span>01</span> CREATOR FIRST</div><div><span>02</span> YOUR CONTENT</div><div><span>03</span> YOUR RULES</div><div><span>04</span> YOUR EMPIRE</div></section>

      <section className="section-wrap section-block" id="experience">
        <div className="section-heading"><p className="eyebrow">POWER THAT STAYS YOURS</p><h2>Make every connection <span>count.</span></h2><p>Tools designed to help you build a lasting creator business, with a community at its center.</p></div>
        <div className="benefit-grid">{benefits.map((item) => <article className="benefit-card" key={item.number}><span className="card-number">{item.number}</span><h3>{item.title}</h3><p>{item.body}</p><span className="card-glow" aria-hidden="true" /></article>)}</div>
      </section>

      <section className="creator-section">
        <div className="section-wrap creator-layout">
          <div className="creator-intro"><p className="eyebrow">THE PEOPLE MAKE THE PLATFORM</p><h2>Find your<br /><span>people.</span></h2><p>Discover artists, voices, and makers building something on their own terms.</p><Link className="arrow-link" href="/creators">Explore creators <span aria-hidden="true">→</span></Link></div>
          <div className="creator-grid">{creators.map((creator) => <Link className="creator-card" href="/creators" key={creator.name}><div className={`creator-portrait ${creator.tone}`}><span>{creator.initials}</span><i aria-hidden="true">✦</i></div><div className="creator-meta"><strong>{creator.name}</strong><span>{creator.category}</span></div></Link>)}</div>
        </div>
      </section>

      <section className="section-wrap section-block membership-section">
        <div className="section-heading"><p className="eyebrow">ACCESS ON YOUR TERMS</p><h2>Choose your <span>level.</span></h2><p>Creators set the experience. Members choose how close they want to be.</p></div>
        <div className="tier-grid">{tiers.map((tier, index) => <article className={`tier-card ${index === 3 ? "tier-featured" : ""}`} key={tier.name}><span className="tier-index">0{index + 1}</span><h3>{tier.name}</h3><p className="tier-detail">{tier.detail}</p><p className="tier-price">{tier.price}<small> / month</small></p><span className="tier-rule" /></article>)}</div>
        <p className="pricing-note">Illustrative membership examples. Creators set their own offers and prices.</p>
        <div className="center-action"><Link className="button" href="/pricing">Explore memberships <span aria-hidden="true">↗</span></Link></div>
      </section>

      <section className="join-section"><div className="join-inner"><p className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</p><h2>Control your <span>power.</span></h2><p>Build your world. Bring your people. Make it yours.</p><Link className="button button-light" href="/creators">Join the Elite <span aria-hidden="true">↗</span></Link></div></section>

      <footer className="site-footer"><div className="section-wrap footer-inner"><Link className="wordmark" href="/" aria-label="VIXEN home"><span className="wordmark-v">V</span>IXEN<span className="wordmark-dot">.</span></Link><p>Exclusive. Powerful. Profitable.</p><div className="footer-links"><Link href="/creators">Creators</Link><Link href="/pricing">Memberships</Link><a href="mailto:hello@vixen.example">Contact</a></div><small>© {new Date().getFullYear()} VIXEN. Built for creators.</small></div></footer>
    </main>
  );
}
