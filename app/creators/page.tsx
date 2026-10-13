import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const sampleCreators = [
  { slug: "nova-luxe", handle: "nova.luxe", initials: "NL", name: "Nova Luxe", category: "Music · Culture", tone: "portrait-rose", bio: "Independent sound, studio notes, and the stories behind the work." },
  { slug: "vee-saint", handle: "vee.saint", initials: "VS", name: "Vee Saint", category: "Style · Behind the scenes", tone: "portrait-silver", bio: "Personal style, creative process, and a closer look at the everyday." },
  { slug: "kira-moss", handle: "kira.moss", initials: "KM", name: "Kira Moss", category: "Art · Studio life", tone: "portrait-violet", bio: "New work, visual experiments, and the world around the canvas." },
];

export const metadata = { title: "Discover creators", description: "Find VIXEN creators by their @username or explore creator previews." };

type CreatorsPageProps = { searchParams: Promise<{ q?: string | string[] }> };
type PublicCreator = { username: string; display_name: string | null; avatar_url: string | null };

function safeAvatarUrl(value: string | null) {
  if (!value) return null;
  try {
    return new URL(value).protocol === "https:" ? value : null;
  } catch {
    return null;
  }
}

export default async function CreatorsPage({ searchParams }: CreatorsPageProps) {
  const params = await searchParams;
  const query = (Array.isArray(params.q) ? params.q[0] : params.q)?.trim() ?? "";
  const isHandleSearch = query.startsWith("@");
  const searchTerm = query.replace(/^@/, "").trim().toLocaleLowerCase();
  let liveCreators: PublicCreator[] = [];
  let directoryUnavailable = false;

  try {
    const supabase = await createClient();
    let request = supabase
      .from("profiles")
      .select("username, display_name, avatar_url")
      .eq("is_creator", true)
      .not("username", "is", null)
      .order("username", { ascending: true })
      .limit(24);
    if (searchTerm && /^[a-z0-9._]{1,30}$/i.test(searchTerm)) {
      request = request.ilike("username", `${searchTerm}%`);
    } else if (searchTerm) {
      request = request.limit(0);
    }
    const { data, error } = await request;
    if (error) directoryUnavailable = true;
    else {
      liveCreators = ((data ?? []) as PublicCreator[]).filter((creator) => {
        const username = creator.username?.toLocaleLowerCase() ?? "";
        return /^[a-z0-9._]{1,30}$/i.test(creator.username) && (!searchTerm || username.startsWith(searchTerm));
      });
      if (searchTerm) {
        liveCreators.sort((a, b) =>
          Number(b.username.toLocaleLowerCase() === searchTerm) - Number(a.username.toLocaleLowerCase() === searchTerm),
        );
      }
    }
  } catch {
    directoryUnavailable = true;
  }

  const matchingSamples = sampleCreators.filter((creator) => {
    if (!query) return true;
    const haystack = [creator.handle, creator.name, creator.category, creator.bio].join(" ").toLocaleLowerCase();
    return haystack.includes(searchTerm) && (!isHandleSearch || creator.handle.startsWith(searchTerm));
  });
  const resultCount = liveCreators.length + matchingSamples.length;

  return (
    <main>
      <header className="site-header"><Link className="vixen-subpage-logo" href="/" aria-label="VIXEN home"><Image src="/assets/vixen-mark-3d.png" alt="" width={120} height={120} /></Link><nav className="main-nav" aria-label="Main navigation"><Link href="/creators">Discover</Link><Link href="/store">Store</Link><Link href="/pricing">Memberships</Link></nav><div className="header-actions"><Link className="button button-small" href="/pricing">Explore packages <span aria-hidden="true">↗</span></Link></div></header>
      <section className="subpage-hero creators-hero"><div className="section-wrap"><p className="eyebrow">FIND YOUR PEOPLE</p><h1>Meet the <span>creators.</span></h1><p>Search a creator’s @username to find their profile. You can also explore the clearly marked sample profiles.</p>
        <form className="creators-search" action="/creators" role="search" aria-label="Search creator profiles">
          <label className="visually-hidden" htmlFor="creator-search">Search by creator username or name</label>
          <input id="creator-search" type="search" name="q" defaultValue={query} placeholder="Search by @username or creator name..." />
          <button type="submit">Search <span aria-hidden="true">↗</span></button>
        </form>
      </div></section>
      <section className="section-wrap subpage-content">
        <div className="creators-results-bar"><p aria-live="polite">{query ? `Showing ${resultCount} result${resultCount === 1 ? "" : "s"} for “${query}”` : "Creators and sample profiles"}</p>{query && <Link href="/creators">Clear search</Link>}</div>
        {directoryUnavailable && <p className="creators-directory-note" role="status">Live creator search is temporarily unavailable. Sample profiles are shown separately.</p>}
        {resultCount ? <div className="route-grid">
          {liveCreators.map((creator) => {
            const name = creator.display_name?.trim() || creator.username;
            const avatar = safeAvatarUrl(creator.avatar_url);
            return <Link className="creator-card" href={`/creators/${encodeURIComponent(creator.username)}`} key={`live-${creator.username}`}>
              <div className="creator-portrait portrait-rose">{avatar ? <Image src={avatar} alt="" width={320} height={320} unoptimized /> : <span>{name.slice(0, 2).toLocaleUpperCase()}</span>}<i aria-hidden="true">✦</i></div>
              <div className="creator-meta"><strong>{name}</strong><span>@{creator.username}</span></div>
              <p className="creator-card-bio">View this creator’s public VIXEN profile.</p>
            </Link>;
          })}
          {matchingSamples.map((creator) => <Link className="creator-card" href={`/creators/${creator.slug}`} key={`sample-${creator.slug}`}><div className={`creator-portrait ${creator.tone}`}><span>{creator.initials}</span><i aria-hidden="true">✦</i></div><div className="creator-meta"><strong>{creator.name}</strong><span>Sample · @{creator.handle}</span></div><p className="creator-card-bio">{creator.bio}</p></Link>)}
        </div> : <div className="creators-empty"><span aria-hidden="true">⌕</span><h2>No matching creator username</h2><p>Check the spelling and try the full @username. Sample profiles are marked separately from approved creator accounts.</p><Link className="button button-outline" href="/creators">Browse all profiles</Link></div>}
      </section>
      <footer className="site-footer"><div className="section-wrap footer-inner"><Link className="vixen-subpage-logo" href="/" aria-label="VIXEN home"><Image src="/assets/vixen-mark-3d.png" alt="" width={120} height={120} /></Link><p>Exclusive. Powerful. Profitable.</p><div className="footer-links"><Link href="/">Home</Link><Link href="/store">Store</Link><Link href="/pricing">Memberships</Link></div><small>© {new Date().getFullYear()} VIXEN. Sample profiles are illustrative. <span className="company-name">Verified Interactive Xperience &amp; Entertainment Network</span></small></div></footer>
    </main>
  );
}
