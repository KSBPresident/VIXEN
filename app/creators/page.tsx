import Image from "next/image";
import Link from "next/link";

const creators = [
  { slug: "nova-luxe", initials: "NL", name: "Nova Luxe", category: "Music · Culture", tone: "portrait-rose", bio: "Independent sound, studio notes, and the stories behind the work." },
  { slug: "vee-saint", initials: "VS", name: "Vee Saint", category: "Style · Behind the scenes", tone: "portrait-silver", bio: "Personal style, creative process, and a closer look at the everyday." },
  { slug: "kira-moss", initials: "KM", name: "Kira Moss", category: "Art · Studio life", tone: "portrait-violet", bio: "New work, visual experiments, and the world around the canvas." },
];

export const metadata = { title: "Discover creators", description: "Meet creators building on their own terms with VIXEN." };

type CreatorsPageProps = { searchParams: Promise<{ q?: string | string[] }> };

export default async function CreatorsPage({ searchParams }: CreatorsPageProps) {
  const params = await searchParams;
  const query = (Array.isArray(params.q) ? params.q[0] : params.q)?.trim() ?? "";
  const normalizedQuery = query.toLocaleLowerCase();
  const matchingCreators = normalizedQuery
    ? creators.filter((creator) => [creator.name, creator.category, creator.bio].some((value) => value.toLocaleLowerCase().includes(normalizedQuery)))
    : creators;

  return (
    <main>
      <header className="site-header"><Link className="vixen-subpage-logo" href="/" aria-label="VIXEN home"><Image src="/assets/vixen-mark-3d.png" alt="" width={120} height={120} /></Link><nav className="main-nav" aria-label="Main navigation"><Link href="/creators">Discover</Link><Link href="/store">Store</Link><Link href="/pricing">Memberships</Link></nav><div className="header-actions"><Link className="button button-small" href="/pricing">Explore packages <span aria-hidden="true">↗</span></Link></div></header>
      <section className="subpage-hero creators-hero"><div className="section-wrap"><p className="eyebrow">FIND YOUR PEOPLE</p><h1>Meet the <span>creators.</span></h1><p>Explore sample creator profiles across music, style, and art. Each profile shows how creators can present their work, share updates, and build a community.</p>
        <form className="creators-search" action="/creators" role="search" aria-label="Search creator profiles">
          <label className="visually-hidden" htmlFor="creator-search">Search creators, styles, and interests</label>
          <input id="creator-search" type="search" name="q" defaultValue={query} placeholder="Search creators, styles, and interests..." />
          <button type="submit">Search <span aria-hidden="true">↗</span></button>
        </form>
      </div></section>
      <section className="section-wrap subpage-content">
        <div className="creators-results-bar"><p aria-live="polite">{query ? `Showing ${matchingCreators.length} sample result${matchingCreators.length === 1 ? "" : "s"} for “${query}”` : "Explore all sample creators"}</p>{query && <Link href="/creators">Clear search</Link>}</div>
        {matchingCreators.length ? <div className="route-grid">{matchingCreators.map((creator) => <Link className="creator-card" href={`/creators/${creator.slug}`} key={creator.slug}><div className={`creator-portrait ${creator.tone}`}><span>{creator.initials}</span><i aria-hidden="true">✦</i></div><div className="creator-meta"><strong>{creator.name}</strong><span>{creator.category}</span></div><p className="creator-card-bio">{creator.bio}</p></Link>)}</div> : <div className="creators-empty"><span aria-hidden="true">⌕</span><h2>No creator profiles found</h2><p>Try a name or another interest such as music, style, or art.</p><Link className="button button-outline" href="/creators">Browse all creators</Link></div>}
      </section>
      <footer className="site-footer"><div className="section-wrap footer-inner"><Link className="vixen-subpage-logo" href="/" aria-label="VIXEN home"><Image src="/assets/vixen-mark-3d.png" alt="" width={120} height={120} /></Link><p>Exclusive. Powerful. Profitable.</p><div className="footer-links"><Link href="/">Home</Link><Link href="/store">Store</Link><Link href="/pricing">Memberships</Link></div><small>© {new Date().getFullYear()} VIXEN. Preview creator profiles are illustrative.</small></div></footer>
    </main>
  );
}
