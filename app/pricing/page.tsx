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
    <main><header className="site-header"><Link className="wordmark" href="/"><span className="wordmark-v">V</span>IXEN<span className="wordmark-dot">.</span></Link><nav className="main-nav" aria-label="Main navigation"><Link href="/creators">Discover</Link><Link href="/pricing">Memberships</Link></nav><div className="header-actions"><Link className="button button-small" href="/creators">Meet creators <span aria-hidden="true">↗</span></Link></div></header>
      <section className="subpage-hero"><div className="section-wrap"><p className="eyebrow">ACCESS ON YOUR TERMS</p><h1>Choose your <span>level.</span></h1><p>Creators define their own offers and pricing. These example tiers show how VIXEN can support distinct membership experiences; checkout is not active in this preview.</p></div></section>
      <section className="section-wrap subpage-content"><div className="tier-explainer">{tiers.map((tier, index) => <article className="tier-row" key={tier.name}><div><h2>{tier.name}</h2><p>{tier.detail}</p><p>{tier.points.join(" · ")}</p></div><strong>{tier.price}<small> / month</small></strong></article>)}</div><p className="pricing-note">Prices shown are illustrative examples from the VIXEN design reference, not live offers. Payment processing must be configured before purchases can be made.</p></section>
      <footer className="site-footer"><div className="section-wrap footer-inner"><Link className="wordmark" href="/"><span className="wordmark-v">V</span>IXEN<span className="wordmark-dot">.</span></Link><p>Exclusive. Powerful. Profitable.</p><div className="footer-links"><Link href="/">Home</Link><Link href="/creators">Creators</Link></div><small>© {new Date().getFullYear()} VIXEN.</small></div></footer></main>
  );
}
