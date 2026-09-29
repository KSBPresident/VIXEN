import Image from "next/image";
import Link from "next/link";

const tiers = [
  { name: "Bronze", price: "$9.99", detail: "A first look inside", points: ["Member-only updates", "A closer look at the creator journey"] },
  { name: "Silver", price: "$19.99", detail: "Closer to the creator", points: ["Everything in Bronze", "More exclusive drops"] },
  { name: "Gold", price: "$29.99", detail: "More access, more value", points: ["Everything in Silver", "Priority access to new releases"] },
  { name: "Elite", price: "$49.99", detail: "The full experience", points: ["Everything in Gold", "The most complete creator experience"] },
];

export const metadata = { title: "Memberships", description: "Explore illustrative VIXEN membership tiers." };
export default function PricingPage() {
  return (
    <main><header className="site-header"><Link className="vixen-subpage-logo" href="/" aria-label="VIXEN home"><Image src="/assets/vixen-mark-3d.png" alt="" width={120} height={120} /></Link><nav className="main-nav" aria-label="Main navigation"><Link href="/creators">Discover</Link><Link href="/pricing">Memberships</Link></nav><div className="header-actions"><Link className="button button-small" href="/creators">Meet creators <span aria-hidden="true">↗</span></Link></div></header>
      <section className="subpage-hero"><div className="section-wrap"><p className="eyebrow">ACCESS ON YOUR TERMS</p><h1>Choose your <span>level.</span></h1><p>Creators shape their own packages. VIXEN is designed to let them set pricing and renewal terms, choose member perks, and control which content each package unlocks.</p></div></section>
      <section className="section-wrap subpage-content"><div className="tier-explainer">{tiers.map((tier, index) => <article className="tier-row" key={tier.name}><div><h2>{tier.name}</h2><p>{tier.detail}</p><p>{tier.points.join(" · ")}</p></div><strong>{tier.price}<small> / month</small></strong></article>)}</div><p className="pricing-note">Prices shown are examples only. Each creator will set their own package terms and prices.</p></section>
      <footer className="site-footer"><div className="section-wrap footer-inner"><Link className="vixen-subpage-logo" href="/" aria-label="VIXEN home"><Image src="/assets/vixen-mark-3d.png" alt="" width={120} height={120} /></Link><p>Exclusive. Powerful. Profitable.</p><div className="footer-links"><Link href="/">Home</Link><Link href="/creators">Creators</Link></div><small>© {new Date().getFullYear()} VIXEN.</small></div></footer></main>
  );
}
