import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const metadata = { title: "Discover creators", description: "Find approved VIXEN creators by their @username." };

type CreatorsPageProps = { searchParams: Promise<{ q?: string | string[] }> };
type PublicCreator = { username: string; display_name: string | null; avatar_url: string | null; bio?: string | null };

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
  const searchTerm = query.replace(/^@/, "").trim().toLocaleLowerCase();
  const validSearch = !searchTerm || /^[a-z0-9._]{1,30}$/i.test(searchTerm);
  let creators: PublicCreator[] = [];
  let directoryUnavailable = false;

  try {
    const supabase = await createClient();
    let request = supabase.from("profiles")
      .select("username, display_name, avatar_url, bio")
      .eq("is_creator", true)
      .not("username", "is", null)
      .order("username", { ascending: true })
      .limit(48);
    if (searchTerm && validSearch) request = request.ilike("username", searchTerm + "%");
    if (!validSearch) request = request.limit(0);
    const { data, error } = await request;
    if (error) directoryUnavailable = true;
    else creators = ((data ?? []) as PublicCreator[]).filter((creator) =>
      /^[a-z0-9._]{3,30}$/i.test(creator.username ?? "") &&
      (!searchTerm || creator.username.toLocaleLowerCase().startsWith(searchTerm))
    );
  } catch {
    directoryUnavailable = true;
  }

  return (
    <main>
      <header className="site-header"><Link className="vixen-subpage-logo" href="/" aria-label="VIXEN home"><Image src="/assets/vixen-mark-3d.png" alt="" width={120} height={120} /></Link><nav className="main-nav" aria-label="Main navigation"><Link href="/creators">Discover</Link><Link href="/store">Store</Link><Link href="/pricing">Memberships</Link></nav><div className="header-actions"><Link className="button button-small" href="/pricing">Membership details <span aria-hidden="true">↗</span></Link></div></header>
      <section className="subpage-hero creators-hero"><div className="section-wrap"><p className="eyebrow">FIND YOUR PEOPLE</p><h1>Meet the <span>creators.</span></h1><p>Search approved creator profiles by @username. Only real VIXEN creator accounts appear here.</p>
        <form className="creators-search" action="/creators" role="search" aria-label="Search creator profiles">
          <label className="visually-hidden" htmlFor="creator-search">Search by creator username</label>
          <input id="creator-search" type="search" name="q" defaultValue={query} placeholder="Search by @username..." />
          <button type="submit">Search <span aria-hidden="true">↗</span></button>
        </form>
      </div></section>
      <section className="section-wrap subpage-content">
        <div className="creators-results-bar"><p aria-live="polite">{searchTerm ? "Search results for “" + query + "”" : "Approved creator profiles"}</p>{query && <Link href="/creators">Clear search</Link>}</div>
        {directoryUnavailable ? <div className="creators-empty"><h2>Creator directory is unavailable</h2><p>Refresh the page in a moment. No sample profiles are shown as substitutes.</p></div> :
        creators.length ? <div className="route-grid">{creators.map((creator) => {
          const name = creator.display_name?.trim() || creator.username;
          const avatar = safeAvatarUrl(creator.avatar_url);
          return <Link className="creator-card" href={"/creators/" + encodeURIComponent(creator.username)} key={creator.username}>
            <div className="creator-portrait portrait-rose">{avatar ? <Image src={avatar} alt="" width={320} height={320} unoptimized /> : <span>{name.slice(0, 2).toLocaleUpperCase()}</span>}<i aria-hidden="true">✦</i></div>
            <div className="creator-meta"><strong>{name}</strong><span>@{creator.username}</span></div>
            <p className="creator-card-bio">{creator.bio?.trim() || "View this creator’s public VIXEN profile."}</p>
          </Link>;
        })}</div> :
        <div className="creators-empty"><span aria-hidden="true">⌕</span><h2>{searchTerm ? "No approved creator found" : "Creator profiles are coming soon"}</h2><p>{searchTerm ? "Check the @username and try again. Search results include approved creator accounts only." : "No creator profiles are published yet. New approved creators will appear here when they set up a public profile."}</p>{searchTerm && <Link className="button button-outline" href="/creators">Browse creators</Link>}</div>}
      </section>
      <footer className="site-footer"><div className="section-wrap footer-inner"><Link className="vixen-subpage-logo" href="/" aria-label="VIXEN home"><Image src="/assets/vixen-mark-3d.png" alt="" width={120} height={120} /></Link><p>Exclusive. Powerful. On your terms.</p><div className="footer-links"><Link href="/">Home</Link><Link href="/store">Store</Link><Link href="/pricing">Memberships</Link></div><small>© {new Date().getFullYear()} VIXEN. Creator profiles appear after creator approval.</small></div></footer>
    </main>
  );
}
