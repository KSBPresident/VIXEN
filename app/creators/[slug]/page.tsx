import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import "../../member-preview/member-preview.css";
import "../../member-preview/member-interactions.css";
import "../../member-preview/member-search.css";

const creators = {
  "nova-luxe": { initials: "NL", name: "Nova Luxe", category: "Music · Culture", tone: "portrait-rose", bio: "Independent sound, studio notes, and the stories behind the work.", message: "Preview creator profile. Membership and paid-message actions are not live until payment and account services are configured." },
  "vee-saint": { initials: "VS", name: "Vee Saint", category: "Style · Behind the scenes", tone: "portrait-silver", bio: "Personal style, creative process, and a closer look at the everyday.", message: "Preview creator profile. Membership and paid-message actions are not live until payment and account services are configured." },
  "kira-moss": { initials: "KM", name: "Kira Moss", category: "Art · Studio life", tone: "portrait-violet", bio: "New work, visual experiments, and the world around the canvas.", message: "Preview creator profile. Membership and paid-message actions are not live until payment and account services are configured." },
};

type CreatorSlug = keyof typeof creators;
export function generateStaticParams() { return Object.keys(creators).map((slug) => ({ slug })); }

export default async function CreatorProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const sampleCreator = Object.hasOwn(creators, slug) ? creators[slug as CreatorSlug] : null;
  let liveCreator: { username: string; display_name: string | null; avatar_url: string | null } | null = null;
  if (!sampleCreator && /^[a-z0-9._]{1,30}$/i.test(slug)) {
    try {
      const supabase = await createClient();
      const { data } = await supabase.from("profiles")
        .select("username, display_name, avatar_url")
        .eq("is_creator", true)
        .ilike("username", slug)
        .maybeSingle();
      liveCreator = data;
    } catch {
      liveCreator = null;
    }
  }
  if (!sampleCreator && !liveCreator) notFound();

  if (liveCreator && !sampleCreator) {
    const name = liveCreator.display_name?.trim() || liveCreator.username;
    const avatar = liveCreator.avatar_url && /^https:\/\//i.test(liveCreator.avatar_url) ? liveCreator.avatar_url : null;
    return (
      <main className="member-app">
        <header className="member-topbar">
          <Link href="/" className="member-brand" aria-label="VIXEN home"><Image src="/assets/vixen-mark-3d.png" alt="" width={62} height={62} priority /><span>VIXEN</span></Link>
          <form className="member-search" action="/creators" role="search" aria-label="Search creators"><span aria-hidden="true">⌕</span><label className="visually-hidden" htmlFor="creator-live-search">Search by @username</label><input id="creator-live-search" type="search" name="q" placeholder="Search by @username" /><button type="submit" aria-label="Search creators">↵</button></form>
          <div className="member-top-actions"><span className="member-preview-pill"><i /> CREATOR</span><Link href="/sign-up?type=member">Create free account <b aria-hidden="true">↗</b></Link></div>
        </header>
        <div className="member-shell">
          <aside className="member-sidebar"><p className="member-sidebar-label">YOUR VIXEN</p><nav className="member-sidebar-navigation" aria-label="Member app navigation">
            <Link className="member-nav-item" href="/member-preview"><span>▦</span> For you</Link><Link className="member-nav-item is-active" href="/creators"><span>⌕</span> Discover creators</Link><Link className="member-nav-item" href="/pricing"><span>◇</span> Memberships</Link><Link className="member-nav-item" href="/member-preview/sessions"><span>◉</span> Private video</Link><Link className="member-nav-item" href="/member-preview/messages"><span>✉</span> vMessage</Link><Link className="member-nav-item" href="/store"><span>⌑</span> Store</Link>
          </nav><div className="member-sidebar-card"><span className="member-sidebar-spark">✦</span><strong>Explore on VIXEN</strong><p>Review a creator’s available membership details before joining.</p><Link href="/sign-up?type=member">Join free <span aria-hidden="true">→</span></Link></div><div className="member-sidebar-foot"><span>Adults 18+ only</span><span>Verified Interactive Xperience &amp; Entertainment Network</span></div></aside>
          <section className="member-main interaction-workspace creator-app-profile" aria-labelledby="creator-name">
            <nav className="creator-profile-toolbar" aria-label="Main navigation"><Link href="/creators">Discover</Link><Link href="/pricing">Memberships</Link><Link href="/member-preview/sessions">Private video</Link></nav>
            <div className="creator-profile-banner">{avatar ? <Image className="member-avatar" src={avatar} alt="" width={96} height={96} unoptimized /> : <span className="member-avatar portrait-rose">{name.slice(0, 2).toLocaleUpperCase()}</span>}<span className="creator-profile-banner-label">VIXEN CREATOR PROFILE</span></div>
            <div className="creator-profile-heading"><div><p className="member-eyebrow"><span /> CREATOR PROFILE</p><h1 id="creator-name">{name}</h1><p className="creator-profile-category">@{liveCreator.username}</p></div><Link className="session-request-button session-preview-open creator-profile-primary" href="/pricing">View membership options <span aria-hidden="true">→</span></Link></div>
            <div className="interaction-status" role="note"><span className="interaction-status-mark" aria-hidden="true">ⓘ</span><span><strong>Creator profile.</strong> Only the creator’s approved public username, display name, and profile image are shown here. No private account information is exposed.</span></div>
            <section className="creator-profile-feed-empty"><p className="member-eyebrow">CREATOR FEED</p><h2>Updates will appear here.</h2><p>This creator has not published a public feed post yet.</p><Link href="/member-preview">Explore the VIXEN member experience <span aria-hidden="true">→</span></Link></section>
          </section>
          <aside className="member-right-rail" aria-label="Creator membership"><section className="member-rail-card member-join-card"><p className="member-eyebrow">MEMBER ACCESS</p><h2>Get to know<br /><em>@{liveCreator.username}</em></h2><p>Check the listed price, access, and limits before choosing any creator membership.</p><Link href="/pricing">Review membership options <span aria-hidden="true">→</span></Link></section><section className="member-rail-card member-tier-card"><p className="member-eyebrow">vMESSAGE</p><h2>Creator messaging.</h2><p>Private messaging is a planned VIXEN feature; this preview does not send or save messages.</p><Link href="/member-preview/messages">Explore vMessage <span aria-hidden="true">→</span></Link></section><p className="member-rail-foot">Public profile fields only. Membership and messaging actions are preview links.</p></aside>
        </div>
        <nav className="member-mobile-nav" aria-label="Member app navigation"><Link href="/member-preview"><span>▦</span>Home</Link><Link href="/creators" aria-current="page"><span>⌕</span>Discover</Link><Link href="/member-preview/messages"><span>✉</span>vMessage</Link><Link href="/member-preview/sessions"><span>◉</span>Video</Link></nav>
      </main>
    );
  }

  const creator = sampleCreator!;
  const pricingHref = "/pricing?creator=" + encodeURIComponent(creator.name);

  return (
    <main className="member-app">
      <header className="member-topbar">
        <Link href="/" className="member-brand" aria-label="VIXEN home"><Image src="/assets/vixen-mark-3d.png" alt="" width={62} height={62} priority /><span>VIXEN</span></Link>
        <form className="member-search" action="/creators" role="search" aria-label="Search creators"><span aria-hidden="true">⌕</span><label className="visually-hidden" htmlFor="creator-profile-search">Search creators</label><input id="creator-profile-search" type="search" name="q" placeholder="Search creators and interests" /><button type="submit" aria-label="Search creators">↵</button></form>
        <div className="member-top-actions"><span className="member-preview-pill"><i /> PREVIEW</span><Link href="/sign-up?type=member">Create free account <b aria-hidden="true">↗</b></Link></div>
      </header>
      <div className="member-shell">
        <aside className="member-sidebar"><p className="member-sidebar-label">YOUR VIXEN</p>
          <nav className="member-sidebar-navigation" aria-label="Member app navigation">
            <Link className="member-nav-item" href="/member-preview"><span>▦</span> For you</Link><Link className="member-nav-item is-active" href="/creators"><span>⌕</span> Discover creators</Link><Link className="member-nav-item" href="/pricing"><span>◇</span> Memberships</Link><Link className="member-nav-item" href="/member-preview/sessions"><span>◉</span> Private video</Link><Link className="member-nav-item" href="/member-preview/messages"><span>✉</span> vMessage</Link><Link className="member-nav-item" href="/store"><span>⌑</span> Store</Link>
          </nav>
          <div className="member-sidebar-card"><span className="member-sidebar-spark">✦</span><strong>New to VIXEN?</strong><p>Join free to browse. Choose creator memberships or a private call separately.</p><Link href="/sign-up?type=member">Join free <span aria-hidden="true">→</span></Link></div>
          <div className="member-sidebar-foot"><span>Adults 18+ only</span><span>Verified Interactive Xperience &amp; Entertainment Network</span></div>
        </aside>
        <section className="member-main interaction-workspace creator-app-profile" aria-labelledby="creator-name">
          <nav className="creator-profile-toolbar" aria-label="Main navigation"><Link href="/creators">Discover</Link><Link href={pricingHref}>Memberships</Link><Link href="/member-preview/sessions">Private video</Link></nav>
          <div className="creator-profile-banner"><span className={`member-avatar ${creator.tone}`}>{creator.initials}</span><span className="creator-profile-banner-label">VIXEN CREATOR PROFILE</span></div>
          <div className="creator-profile-heading"><div><p className="member-eyebrow"><span /> CREATOR PREVIEW</p><h1 id="creator-name">{creator.name}</h1><p className="creator-profile-category">{creator.category}</p></div><Link className="session-request-button session-preview-open creator-profile-primary" href={"/member-preview/sessions?creator=" + encodeURIComponent(slug)}>Book a private call <span aria-hidden="true">→</span></Link></div>
          <p className="creator-profile-bio">{creator.bio}</p>
          <div className="interaction-status" role="note"><span className="interaction-status-mark" aria-hidden="true">ⓘ</span><span><strong>Sample profile.</strong> Posts, availability, prices, messaging, membership, and creator identity are not live or verified on this preview.</span></div>
          <section className="creator-profile-actions" aria-label="Creator options"><div><p className="member-eyebrow">FOLLOW THEIR WORK</p><h2>Choose how you connect.</h2><p>Creator memberships provide the listed access for that creator. Private video calls are a separate, one-time purchase when available.</p></div><div className="creator-profile-action-buttons"><Link className="session-request-button session-preview-open" href={pricingHref}>View membership options <span aria-hidden="true">→</span></Link><Link className="session-flow-back" href="/member-preview/messages">Open vMessage preview</Link></div></section>
          <section className="creator-profile-feed-empty"><p className="member-eyebrow">CREATOR FEED</p><h2>Updates will appear here.</h2><p>This preview does not contain real creator posts. Explore the VIXEN member app layout.</p><Link href="/member-preview">Explore the member feed <span aria-hidden="true">→</span></Link></section>
        </section>
        <aside className="member-right-rail" aria-label="Membership and private video">
          <section className="member-rail-card member-join-card"><p className="member-eyebrow">MEMBER ACCESS</p><h2>Join for free.<br /><em>Choose what’s next.</em></h2><p>Preview this creator, then review memberships or a private call before making a choice.</p><Link href="/sign-up?type=member">Create a free account <span aria-hidden="true">→</span></Link></section>
          <section className="member-rail-card member-tier-card"><p className="member-eyebrow">PRIVATE VIDEO</p><h2>Pay for a booked call.</h2><p>Private video has its own one-time session price; a subscription does not include the call.</p><Link href={"/member-preview/sessions?creator=" + encodeURIComponent(slug)}>Review the call flow <span aria-hidden="true">→</span></Link></section>
          <section className="member-rail-card member-tier-card"><p className="member-eyebrow">MEMBERSHIP</p><h2>Know what you’re buying.</h2><p>Review each creator’s tier price, inclusions, and limits before subscribing.</p><Link href={pricingHref}>See membership options <span aria-hidden="true">→</span></Link></section>
          <p className="member-rail-foot">All profiles in this preview are illustrative. Real creator accounts and services are not active.</p>
        </aside>
      </div>
      <nav className="member-mobile-nav" aria-label="Member app navigation"><Link href="/member-preview"><span>▦</span>Home</Link><Link href="/creators" aria-current="page"><span>⌕</span>Discover</Link><Link href="/member-preview/messages"><span>✉</span>Messages</Link><Link href="/member-preview/sessions"><span>◉</span>Video</Link></nav>
    </main>
  );
}
