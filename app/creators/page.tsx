import Link from "next/link";

const creators = [
  { slug: "nova-luxe", initials: "NL", name: "Nova Luxe", category: "Music · Culture", tone: "portrait-rose", bio: "Independent sound, studio notes, and the stories behind the work." },
  { slug: "vee-saint", initials: "VS", name: "Vee Saint", category: "Style · Behind the scenes", tone: "portrait-silver", bio: "Personal style, creative process, and a closer look at the everyday." },
  { slug: "kira-moss", initials: "KM", name: "Kira Moss", category: "Art · Studio life", tone: "portrait-violet", bio: "New work, visual experiments, and the world around the canvas." },
];

export const metadata = { title: "Discover creators", description: "Meet creators building on their own terms with VIXEN." };

export default function CreatorsPage() {
  return (
    <main>
      <header className="site-header"><Link className="wordmark" href="/"><span className="wordmark-v">V</span>IXEN<span className="wordmark-dot">.</span></Link><nav className="main-nav" aria-label="Main navigation"><Link href="/creators">Discover</Link><Link href="/pricing">Memberships</Link></nav><div className="header-actions"><Link className="button button-small" href="/pricing">Join the Elite <span aria-hidden="true">↗</span></Link></div></header>
      <section className="subpage-hero"><div className="section-wrap"><p className="eyebrow">FIND YOUR PEOPLE</p><h1>Meet the <span>creators.</span></h1><p>Explore artists, voices, and makers building their own worlds. These are preview profiles; live creator accounts will appear once VIXEN membership services are connected.</p></div></section>
      <section className="section-wrap subpage-content"><div className="route-grid">{creators.map((creator) => <Link className="creator-card" href={`/creators/${creator.slug}`} key={creator.slug}><div className={`creator-portrait ${creator.tone}`}><span>{creator.initials}</span><i aria-hidden="true">✦</i></div><div className="creator-meta"><strong>{creator.name}</strong><span>{creator.category}</span></div></Link>)}</div></section>
      <footer className="site-footer"><div className="section-wrap footer-inner"><Link className="wordmark" href="/"><span className="wordmark-v">V</span>IXEN<span className="wordmark-dot">.</span></Link><p>Exclusive. Powerful. Profitable.</p><div className="footer-links"><Link href="/">Home</Link><Link href="/pricing">Memberships</Link></div><small>© {new Date().getFullYear()} VIXEN. Preview creator profiles are illustrative.</small></div></footer>
    </main>
  );
}
