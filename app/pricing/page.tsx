import Image from "next/image";
import Link from "next/link";

const plans = [
  {
    id: "free",
    name: "Free account",
    price: "$0",
    billing: "No payment or renewal",
    summary: "Join VIXEN and explore public creator pages.",
    included: ["Browse creator profiles", "View public posts and previews", "No card and no recurring charge"],
    excluded: "Member-only posts and drops, paid messages, tips, creator publishing, payouts, and management tools.",
    free: true,
  },
  {
    id: "bronze",
    name: "Bronze",
    price: "$9.99",
    billing: "example / month / creator",
    summary: "A first step into one creator’s membership.",
    included: ["Everything in Free", "Bronze-only member posts and updates from that creator"],
    excluded: "Silver, Gold, and Elite content; paid messages, tips, and one-off purchases unless the creator explicitly includes them.",
  },
  {
    id: "silver",
    name: "Silver",
    price: "$19.99",
    billing: "example / month / creator",
    summary: "More exclusive access from one creator.",
    included: ["Everything in Bronze", "Silver-only posts and creator-listed exclusive drops"],
    excluded: "Gold and Elite content; paid messages, tips, and one-off purchases unless the creator explicitly includes them.",
  },
  {
    id: "gold",
    name: "Gold",
    price: "$29.99",
    billing: "example / month / creator",
    summary: "Expanded membership access.",
    included: ["Everything in Silver", "Gold-only posts and drops", "Early access when listed by the creator"],
    excluded: "Elite-only content; paid messages, tips, and one-off purchases unless the creator explicitly includes them.",
  },
  {
    id: "elite",
    name: "Elite",
    price: "$49.99",
    billing: "example / month / creator",
    summary: "The highest membership level offered in this example.",
    included: ["Everything in Gold", "Elite-only posts, drops, and perks explicitly listed by the creator"],
    excluded: "Unlisted services, paid messages, tips, custom work, or one-off purchases. Elite does not mean unlimited access or guaranteed replies.",
  },
];

export const metadata = {
  title: "Free accounts and memberships",
  description: "Compare free VIXEN accounts with creator-specific membership access.",
};

export default function PricingPage() {
  return (
    <main>
      <header className="site-header">
        <Link className="vixen-subpage-logo" href="/" aria-label="VIXEN home">
          <Image src="/assets/vixen-mark-3d.png" alt="" width={120} height={120} />
        </Link>
        <nav className="main-nav" aria-label="Main navigation">
          <Link href="/creators">Discover</Link>
          <Link href="/store">Store</Link>
          <Link href="/pricing" aria-current="page">Memberships</Link>
        </nav>
        <div className="header-actions">
          <Link className="button button-small" href="/sign-up">Join free <span aria-hidden="true">↗</span></Link>
        </div>
      </header>

      <section className="subpage-hero pricing-hero">
        <div className="section-wrap">
          <p className="eyebrow">ACCESS ON YOUR TERMS</p>
          <h1>Free to join.<br /><span>Clear what unlocks.</span></h1>
          <p>Start with a free member account. If you choose to pay for a creator membership, the tier should say exactly which creator’s content and perks it includes.</p>
        </div>
      </section>

      <section className="section-wrap plan-section" aria-labelledby="plan-heading">
        <div className="plan-section-heading">
          <p className="eyebrow">COMPARE ACCESS</p>
          <h2 id="plan-heading">Choose what works for you.</h2>
          <p>Paid prices below are examples. Creators set their own prices and listed perks.</p>
        </div>

        <div className="member-plan-grid">
          {plans.map((plan) => (
            <article className={`member-plan-card${plan.free ? " member-plan-free" : ""}`} key={plan.id} aria-labelledby={`plan-${plan.id}`}>
              <header className="member-plan-header">
                <p className="member-plan-kind">{plan.free ? "MEMBER ACCOUNT" : "CREATOR MEMBERSHIP"}</p>
                <h3 id={`plan-${plan.id}`}>{plan.name}</h3>
                <p>{plan.summary}</p>
                <p className="member-plan-price"><strong>{plan.price}</strong><span>{plan.billing}</span></p>
              </header>

              <div className="member-plan-includes">
                <h4>Included</h4>
                <ul>{plan.included.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>

              <div className="member-plan-boundary">
                <h4>Not included</h4>
                <p>{plan.excluded}</p>
              </div>

              {plan.free && <Link className="button member-plan-cta" href="/sign-up">Create a free account <span aria-hidden="true">↗</span></Link>}
            </article>
          ))}
        </div>
      </section>

      <section className="section-wrap nine-offer" aria-labelledby="nine-offer-title">
        <div className="nine-offer-mark" aria-hidden="true">NINE</div>
        <div className="nine-offer-copy">
          <p className="eyebrow">PLANNED PAYMENT BENEFIT</p>
          <h2 id="nine-offer-title">Pay with NINE. <span>Save 50%.</span></h2>
          <p>When NINE Coin payments are supported, get 50% off any VIXEN creator subscription paid with NINE.</p>
          <p className="nine-offer-status">Coming later · This offer is not redeemable today. VIXEN does not currently accept NINE Coin. Supported networks, payment verification, and purchase sources will be confirmed before launch.</p>
        </div>
      </section>

      <section className="section-wrap payment-methods" aria-labelledby="payment-methods-title">
        <div>
          <p className="eyebrow">FLEXIBLE WAYS TO PAY</p>
          <h2 id="payment-methods-title">Payment options are being prepared.</h2>
          <p>VIXEN plans to support the methods below. The options available will depend on your location and what you’re buying, and will be confirmed before checkout.</p>
        </div>
        <ul className="payment-method-list" aria-label="Planned payment methods">
          <li>Card payments</li>
          <li>Bank transfer</li>
          <li>Cryptocurrency</li>
          <li>WiPay</li>
          <li>PayPal</li>
          <li>Wise</li>
        </ul>
        <p className="payment-method-note">These payment methods are not active yet. No payment is taken from this preview. Supported crypto coins and networks, including NINE Coin, will be confirmed before any crypto checkout opens.</p>
      </section>

      <section className="section-wrap plan-terms" aria-labelledby="payment-terms-heading">
        <h2 id="payment-terms-heading">Before you pay</h2>
        <ul>
          <li>A creator membership applies to that creator only; it is not a site-wide pass.</li>
          <li>You receive only the posts, drops, and perks named in that creator’s selected tier.</li>
          <li>Paid messages, tips, custom work, and one-off purchases cost extra unless the creator clearly lists them as included.</li>
          <li>Memberships are intended to renew on the billing schedule shown at checkout. Renewal date, cancellation, and refund terms must be shown before payment.</li>
          <li>Membership access does not grant permission to copy, repost, or redistribute creator content.</li>
        </ul>
        <p className="pricing-preview-notice"><strong>Preview only:</strong> these prices and tiers describe the planned package structure. Account registration, checkout, recurring billing, and tier access are not active yet. No payment is taken from this page.</p>
        <Link className="vixen-discover-link" href="/creators">Browse creator previews <span aria-hidden="true">→</span></Link>
      </section>

      <footer className="site-footer">
        <div className="section-wrap footer-inner">
          <Link className="vixen-subpage-logo" href="/" aria-label="VIXEN home"><Image src="/assets/vixen-mark-3d.png" alt="" width={120} height={120} /></Link>
          <p>Exclusive. Powerful. Profitable.</p>
          <div className="footer-links"><Link href="/">Home</Link><Link href="/creators">Creators</Link><Link href="/store">Store</Link><Link href="/sign-up">Join free</Link></div>
          <small>© {new Date().getFullYear()} VIXEN. Prices and packages shown are illustrative.</small>
        </div>
      </footer>
    </main>
  );
}
