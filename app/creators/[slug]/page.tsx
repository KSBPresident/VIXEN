import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import "../../member-preview/member-preview.css";
import "../../member-preview/member-interactions.css";
import "../../member-preview/member-search.css";

export const dynamic = "force-dynamic";
export const metadata = { title: "Creator profile · VIXEN", robots: { index: false, follow: false } };
type CreatorFeedPost = { id: string; caption: string; media_path: string | null; media_type: string | null; created_at: string; mediaUrl: string | null };

export default async function CreatorProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!/^[a-z0-9._]{3,30}$/i.test(slug)) notFound();

  let creator: { id: string; username: string; display_name: string | null; avatar_url: string | null; cover_url: string | null; bio: string | null } | null = null;
  let feedPosts: CreatorFeedPost[] = [];
  let feedAvailable = false;
  let isSignedIn = false;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    isSignedIn = Boolean(user);
    const { data } = await supabase.from("profiles")
      .select("id, username, display_name, avatar_url, cover_url, bio")
      .eq("is_creator", true)
      .ilike("username", slug)
      .maybeSingle();
    creator = data;
    if (data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const feed = await (supabase as any).from("creator_posts").select("id,caption,media_path,media_type,created_at").eq("creator_id", data.id).eq("status", "published").order("created_at", { ascending: false }).limit(50);
      feedAvailable = !feed.error;
      feedPosts = ((feed.data ?? []) as Omit<CreatorFeedPost, "mediaUrl">[]).map((post) => ({ ...post, mediaUrl: post.media_path ? supabase.storage.from("creator-feed-media").getPublicUrl(post.media_path).data.publicUrl : null }));
    }
  } catch {
    creator = null;
  }
  if (!creator) notFound();

  const name = creator.display_name?.trim() || creator.username;
  const accountHref = isSignedIn ? "/account" : "/sign-up?type=member";
  const accountLabel = isSignedIn ? "My account" : "Create free account";
  const avatar = creator.avatar_url && /^https:\/\//i.test(creator.avatar_url) ? creator.avatar_url : null;
  const cover = creator.cover_url && /^https:\/\//i.test(creator.cover_url) ? creator.cover_url : null;

  return (
    <main className="member-app">
      <header className="member-topbar">
        <Link href="/" className="member-brand" aria-label="VIXEN home"><Image src="/assets/vixen-mark-3d.png" alt="" width={62} height={62} priority /><span>VIXEN</span></Link>
        <form className="member-search" action="/creators" role="search" aria-label="Search creators"><span aria-hidden="true">⌕</span><label className="visually-hidden" htmlFor="creator-profile-search">Search by @username</label><input id="creator-profile-search" type="search" name="q" placeholder="Search by @username" /><button type="submit" aria-label="Search creators">↵</button></form>
        <div className="member-top-actions"><span className="member-preview-pill"><i /> APPROVED CREATOR</span><Link href={accountHref}>{accountLabel} <b aria-hidden="true">↗</b></Link></div>
      </header>
      <div className="member-shell">
        <aside className="member-sidebar"><p className="member-sidebar-label">YOUR VIXEN</p><nav className="member-sidebar-navigation" aria-label="Member app navigation">
          <Link className="member-nav-item" href="/member-preview"><span>▦</span> For you</Link><Link className="member-nav-item is-active" href="/creators"><span>⌕</span> Discover creators</Link><Link className="member-nav-item" href="/pricing"><span>◇</span> Memberships</Link><Link className="member-nav-item" href="/member-preview/sessions"><span>◉</span> Private video</Link><Link className="member-nav-item" href="/member-preview/messages"><span>✉</span> vMessage</Link><Link className="member-nav-item" href="/store"><span>⌑</span> Store</Link>
        </nav><div className="member-sidebar-card"><span className="member-sidebar-spark">✦</span><strong>Explore on VIXEN</strong><p>Review available membership details before joining.</p><Link href={accountHref}>{isSignedIn ? "Open your account" : "Join free"} <span aria-hidden="true">→</span></Link></div><div className="member-sidebar-foot"><span>Adults 18+ only</span><span>Verified Interactive Xperience &amp; Entertainment Network</span></div></aside>
        <section className="member-main interaction-workspace creator-app-profile" aria-labelledby="creator-name">
          <nav className="creator-profile-toolbar" aria-label="Main navigation"><Link href="/creators">Discover</Link><Link href="/pricing">Memberships</Link><Link href="/member-preview/sessions">Private video</Link></nav>
          <div className={"creator-profile-banner" + (cover ? " has-cover" : "")}>{cover && <Image className="creator-profile-cover" src={cover} alt="" fill sizes="(max-width: 760px) 100vw, 760px" unoptimized />}{avatar ? <Image className="member-avatar" src={avatar} alt="" width={96} height={96} unoptimized /> : <span className="member-avatar portrait-violet">{name.slice(0, 2).toLocaleUpperCase()}</span>}<span className="creator-profile-banner-label">VIXEN CREATOR PROFILE</span></div>
          <div className="creator-profile-heading"><div><p className="member-eyebrow"><span /> APPROVED CREATOR</p><h1 id="creator-name">{name}</h1><p className="creator-profile-category">@{creator.username}</p></div><div className="creator-profile-action-buttons"><Link className="session-request-button session-preview-open creator-profile-primary" href="/pricing">View membership options <span aria-hidden="true">→</span></Link><Link className="session-request-button creator-profile-tip" href={"/crypto-payments/proof?type=creator_tip&creator=" + encodeURIComponent(creator.username)}>Tip this creator <span aria-hidden="true">↗</span></Link></div></div>
          {creator.bio?.trim() && <p className="creator-profile-bio">{creator.bio}</p>}
          <div className="interaction-status" role="note"><span className="interaction-status-mark" aria-hidden="true">ⓘ</span><span><strong>Public creator profile.</strong> Only approved public profile details are displayed here.</span></div>
          <section className="creator-profile-feed" aria-labelledby="creator-feed-title"><p className="member-eyebrow">CREATOR FEED</p><h2 id="creator-feed-title">Latest posts</h2>{!feedAvailable ? <p className="creator-profile-feed-empty">Creator posts are being set up. Check back soon.</p> : feedPosts.length === 0 ? <p className="creator-profile-feed-empty">No public posts yet.</p> : <div className="creator-profile-post-list">{feedPosts.map((post) => { const mediaUrl = post.mediaUrl; return <article className="creator-profile-post" key={post.id}><time dateTime={post.created_at}>{new Date(post.created_at).toLocaleString()}</time>{post.caption && <p>{post.caption}</p>}{mediaUrl && post.media_type?.startsWith("video/") && <video controls playsInline preload="metadata" src={mediaUrl}>Your browser cannot play this video.</video>}{mediaUrl && post.media_type?.startsWith("image/") && <Image src={mediaUrl} alt="Creator post" width={960} height={720} unoptimized />}<span>PUBLIC POST</span></article>; })}</div>}</section>
        </section>
        <aside className="member-right-rail" aria-label="Creator membership"><section className="member-rail-card member-join-card"><p className="member-eyebrow">MEMBER ACCESS</p><h2>Get to know<br /><em>@{creator.username}</em></h2><p>Review listed price, access, and limits before choosing a membership.</p><Link href="/pricing">Review membership options <span aria-hidden="true">→</span></Link></section><section className="member-rail-card member-tier-card"><p className="member-eyebrow">vMESSAGE</p><h2>Creator messaging.</h2><p>Private messaging remains a preview and is not active yet.</p><Link href="/member-preview/messages">Explore vMessage <span aria-hidden="true">→</span></Link></section><p className="member-rail-foot">Public profile fields only. Paid access and messaging are not live.</p></aside>
      </div>
      <nav className="member-mobile-nav" aria-label="Member app navigation"><Link href="/member-preview"><span>▦</span>Home</Link><Link href="/creators" aria-current="page"><span>⌕</span>Discover</Link><Link href="/member-preview/messages"><span>✉</span>vMessage</Link><Link href="/member-preview/sessions"><span>◉</span>Video</Link></nav>
    </main>
  );
}
