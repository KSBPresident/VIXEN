import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import "./member-preview.css";
import "./member-interactions.css";
import "./member-search.css";

export const metadata = {
  title: "Member app preview",
  description: "Explore the VIXEN member experience and approved creator profiles.",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

type MemberPreviewPageProps = { searchParams: Promise<{ q?: string | string[] }> };
type PublicCreator = { username: string; display_name: string | null; avatar_url: string | null; bio: string | null };

function safeAvatarUrl(value: string | null) {
  if (!value) return null;
  try { return new URL(value).protocol === "https:" ? value : null; } catch { return null; }
}

export default async function MemberPreviewPage({ searchParams }: MemberPreviewPageProps) {
  let isSignedIn = false;
  let directoryUnavailable = false;
  let creators: PublicCreator[] = [];
  const supabaseConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY));
  if (supabaseConfigured) {
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      isSignedIn = Boolean(user);
      const { data, error } = await supabase.from("profiles")
        .select("username, display_name, avatar_url, bio")
        .eq("is_creator", true)
        .not("username", "is", null)
        .order("username", { ascending: true })
        .limit(24);
      if (error) directoryUnavailable = true;
      else creators = ((data ?? []) as PublicCreator[]).filter((creator) => /^[a-z0-9._]{3,30}$/i.test(creator.username ?? ""));
    } catch { directoryUnavailable = true; }
  } else directoryUnavailable = true;

  const params = await searchParams;
  const query = (Array.isArray(params.q) ? params.q[0] : params.q)?.trim() ?? "";
  const normalizedQuery = query.replace(/^@/, "").toLocaleLowerCase();
  const visibleCreators = normalizedQuery
    ? creators.filter((creator) => creator.username.toLocaleLowerCase().startsWith(normalizedQuery))
    : creators;
  const accountHref = isSignedIn ? "/account" : "/sign-up?type=member";
  const accountLabel = isSignedIn ? "My account" : "Create free account";

  return (
    <main className="member-app">
      <header className="member-topbar">
        <Link href="/" className="member-brand" aria-label="VIXEN home"><Image src="/assets/vixen-mark-3d.png" alt="" width={62} height={62} priority /><span>VIXEN</span></Link>
        <form className="member-search" action="/creators" role="search" aria-label="Search creator profiles"><span aria-hidden="true">⌕</span><label className="visually-hidden" htmlFor="member-creator-search">Search creators by username</label><input id="member-creator-search" type="search" name="q" defaultValue={query} placeholder="Search by @username" /><button type="submit" aria-label="Search creators">↵</button></form>
        <div className="member-top-actions"><span className="member-preview-pill"><i /> PREVIEW</span><Link href={accountHref}>{accountLabel} <b aria-hidden="true">↗</b></Link></div>
      </header>

      <div className="member-shell">
        <aside className="member-sidebar">
          <p className="member-sidebar-label">YOUR VIXEN</p>
          <nav className="member-sidebar-navigation" aria-label="Member app navigation">
            <Link className="member-nav-item is-active" href="/member-preview"><span>▦</span> For you</Link>
            <Link className="member-nav-item" href="/creators"><span>⌕</span> Discover creators</Link>
            <Link className="member-nav-item" href="/pricing"><span>◇</span> Memberships</Link>
            <Link className="member-nav-item" href="/store"><span>⌑</span> Store</Link>
            <Link className="member-nav-item" href="/member-preview/messages"><span>✉</span> vMessage <small>Preview</small></Link>
            <Link className="member-nav-item" href="/member-preview/sessions"><span>◉</span> Private video <small>Preview</small></Link>
          </nav>
          <div className="member-sidebar-card"><span className="member-sidebar-spark">✦</span><strong>{isSignedIn ? "Your account is active" : "Your VIXEN account"}</strong><p>{isSignedIn ? "Your account settings are ready." : "Create a free member login and follow approved creators as they join."}</p><Link href={accountHref}>{isSignedIn ? "Open account" : "Join free"} <span aria-hidden="true">→</span></Link></div>
          <div className="member-sidebar-foot"><span>Adults 18+ only</span><span>Verified Interactive Xperience &amp; Entertainment Network</span></div>
        </aside>

        <section className="member-main" aria-labelledby="member-heading">
          <div className="member-welcome"><div><p className="member-eyebrow"><span /> THE MEMBER EXPERIENCE · PREVIEW</p><h1 id="member-heading">Your world.<br /><em>Your way.</em></h1><p>Discover approved creator profiles and see the VIXEN member app layout.</p></div><div className="member-welcome-art" aria-hidden="true"><span>V</span><i>✦</i><b>VIXEN</b></div></div>
          <div className="member-notice"><span aria-hidden="true">ⓘ</span><p><strong>{directoryUnavailable ? "Live creator data is unavailable." : "This is a member workspace preview."}</strong> Only approved profiles are shown. Creator posts, paid content, subscriptions, vMessage, private video, and checkout are not active yet.</p><Link href={accountHref}>{isSignedIn ? "Open your account" : "About sign-up"} <span aria-hidden="true">→</span></Link></div>

          <div className="member-feed-heading"><div><p className="member-eyebrow">DISCOVERY</p><h2>Approved creators</h2></div><Link href="/creators">Browse directory <span aria-hidden="true">→</span></Link></div>
          <p className="member-results-count" aria-live="polite">{query ? visibleCreators.length + " creator profiles for “" + query + "”" : visibleCreators.length + " approved creator profiles"}</p>
          {directoryUnavailable ? <div className="member-search-empty"><h3>Creator profiles could not be loaded</h3><p>Please refresh in a moment. No sample profiles are substituted.</p></div> :
            visibleCreators.length ? <div className="member-post-list">{visibleCreators.map((creator) => {
              const name = creator.display_name?.trim() || creator.username;
              const avatar = safeAvatarUrl(creator.avatar_url);
              return <article className="member-post" key={creator.username}>
                <div className="member-post-header">{avatar ? <Image className="member-avatar" src={avatar} alt="" width={56} height={56} unoptimized /> : <div className="member-avatar portrait-violet">{name.slice(0,2).toLocaleUpperCase()}</div>}<div className="member-post-author"><Link href={"/creators/" + encodeURIComponent(creator.username)}>{name} <span className="member-verified" aria-label="Approved creator">✦</span></Link><small>@{creator.username}</small></div></div>
                <div className="member-post-body"><div><p className="member-post-category">APPROVED CREATOR</p><h3>{name} on VIXEN</h3><p>{creator.bio?.trim() || "Public creator profile."}</p></div><Link className="member-post-open" href={"/creators/" + encodeURIComponent(creator.username)}>View profile <span aria-hidden="true">↗</span></Link></div>
                <div className="member-post-footer"><span>Approved public profile</span><Link href="/pricing">Membership details <span aria-hidden="true">→</span></Link></div>
              </article>;
            })}</div> :
            <div className="member-search-empty"><span aria-hidden="true">⌕</span><h3>{query ? "No matching approved creator" : "No creator profiles published yet"}</h3><p>{query ? "Check the creator’s @username and try again." : "Approved creators will appear here after they publish their real profiles."}</p><Link href="/creators">Open Discover</Link></div>}
          <div className="member-bottom-cta"><div><p className="member-eyebrow">{isSignedIn ? "YOU’RE SIGNED IN" : "READY WHEN YOU ARE"}</p><h2>{isSignedIn ? "Your VIXEN account is ready." : "Start with a free member account."}</h2><p>{isSignedIn ? "Open your account settings or explore approved creator profiles." : "Members are adults 18+ of any gender. Creator accounts are separate and intended for adult women creators."}</p></div><Link className="member-primary-button" href={accountHref}>{isSignedIn ? "Open your account" : "Create a free account"} <span aria-hidden="true">↗</span></Link></div>
        </section>

        <aside className="member-right-rail" aria-label="Membership and discovery">
          <section className="member-rail-card member-join-card"><p className="member-eyebrow">{isSignedIn ? "YOUR MEMBER ACCESS" : "MEMBER ACCESS"}</p><h2>{isSignedIn ? "You’re signed in." : <>Join for free.<br /><em>Choose what’s next.</em></>}</h2><p>{isSignedIn ? "Your profile and account settings are ready." : "Browse real creator profiles first. Decide on paid access only when its price and features are clear."}</p><Link href={accountHref}>{isSignedIn ? "Open your account" : "Create your account"} <span aria-hidden="true">→</span></Link></section>
          <section className="member-rail-section"><div className="member-rail-heading"><h2>Explore creators</h2><Link href="/creators">All <span aria-hidden="true">→</span></Link></div>{visibleCreators.slice(0,4).map((creator) => <Link className="member-creator-mini" href={"/creators/" + encodeURIComponent(creator.username)} key={creator.username}><span className="member-avatar portrait-violet">{(creator.display_name || creator.username).slice(0,2).toLocaleUpperCase()}</span><span><strong>{creator.display_name || creator.username}</strong><small>@{creator.username}</small></span><b aria-hidden="true">↗</b></Link>)}{visibleCreators.length===0 && <p className="member-rail-foot">No approved creator profiles yet.</p>}</section>
          <section className="member-rail-card member-tier-card"><p className="member-eyebrow">CLEAR MEMBERSHIPS</p><h2>Know what’s included.</h2><p>Review creator access and boundaries before choosing a membership.</p><Link href="/pricing">See packages and boundaries <span aria-hidden="true">→</span></Link></section>
          <section className="member-rail-card member-tier-card"><p className="member-eyebrow">MEMBER TOOLS</p><h2>Talk or meet.</h2><p>Messages and private video are previews; those services are not active yet.</p><Link href="/member-preview/messages">vMessage preview <span aria-hidden="true">→</span></Link><br /><Link href="/member-preview/sessions">Private video preview <span aria-hidden="true">→</span></Link></section>
          <section className="member-rail-card member-nine-card"><span className="member-nine-mark">9</span><div><p className="member-eyebrow">NINE COIN · PLANNED</p><h2>10% subscription discount</h2><p>Planned for eligible subscriptions; no NINE Coin discount is currently applied.</p><Link href="/pricing">Offer details <span aria-hidden="true">→</span></Link></div></section>
          <p className="member-rail-foot">Only actual, approved creator profiles appear in VIXEN directories.</p>
        </aside>
      </div>
      <nav className="member-mobile-nav" aria-label="Mobile app navigation"><Link href="/member-preview" aria-current="page"><span>▦</span>Home</Link><Link href="/creators"><span>⌕</span>Discover</Link><Link href="/pricing"><span>◇</span>Plans</Link><Link href="/store"><span>⌑</span>Store</Link><Link href={accountHref}><span>◉</span>{isSignedIn ? "Account" : "Join"}</Link></nav>
    </main>
  );
}
