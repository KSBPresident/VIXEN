import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

const creators = {
  "nova-luxe": { initials: "NL", name: "Nova Luxe", category: "Music · Culture", tone: "portrait-rose", bio: "Independent sound, studio notes, and the stories behind the work.", message: "Preview creator profile. Membership and paid-message actions are not live until payment and account services are configured." },
  "vee-saint": { initials: "VS", name: "Vee Saint", category: "Style · Behind the scenes", tone: "portrait-silver", bio: "Personal style, creative process, and a closer look at the everyday.", message: "Preview creator profile. Membership and paid-message actions are not live until payment and account services are configured." },
  "kira-moss": { initials: "KM", name: "Kira Moss", category: "Art · Studio life", tone: "portrait-violet", bio: "New work, visual experiments, and the world around the canvas.", message: "Preview creator profile. Membership and paid-message actions are not live until payment and account services are configured." },
};

type CreatorSlug = keyof typeof creators;
export function generateStaticParams() { return Object.keys(creators).map((slug) => ({ slug })); }
export default async function CreatorProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!(slug in creators)) notFound();
  const creator = creators[slug as CreatorSlug];
  return (
    <main><header className="site-header"><Link className="vixen-subpage-logo" href="/" aria-label="VIXEN home"><Image src="/assets/vixen-mark-3d.png" alt="" width={120} height={120} /></Link><nav className="main-nav" aria-label="Main navigation"><Link href="/creators">Discover</Link><Link href="/pricing">Memberships</Link></nav><div className="header-actions"><Link className="button button-small" href="/pricing">View memberships <span aria-hidden="true">↗</span></Link></div></header>
      <section className="section-wrap profile-layout"><div className={`profile-portrait creator-portrait ${creator.tone}`}><span>{creator.initials}</span></div><div className="profile-copy"><p className="eyebrow">VIXEN CREATOR PREVIEW</p><h1>{creator.name}</h1><p className="profile-category">{creator.category}</p><p>{creator.bio}</p><div className="profile-notice">{creator.message}</div><div className="hero-actions"><Link className="button" href="/pricing">Explore memberships <span aria-hidden="true">↗</span></Link><Link className="button button-outline" href="/creators">Back to creators</Link></div></div></section>
      <footer className="site-footer"><div className="section-wrap footer-inner"><Link className="vixen-subpage-logo" href="/" aria-label="VIXEN home"><Image src="/assets/vixen-mark-3d.png" alt="" width={120} height={120} /></Link><p>Exclusive. Powerful. Profitable.</p><small>© {new Date().getFullYear()} VIXEN. <span className="company-name">Verified Interactive Xperience &amp; Entertainment Network</span></small></div></footer></main>
  );
}
