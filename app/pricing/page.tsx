import Image from "next/image";
import { getMembershipPricingPreview } from "@/lib/application/pricing/get-membership-pricing-preview";
import Link from "next/link";
import "./pricing-upgrade.css";
import "./cost-clarity.css";

export const metadata = {
  title: "Free accounts and memberships",
  description: "Compare free VIXEN accounts with creator-specific membership access.",
};

export default function PricingPage() {
  const plans = getMembershipPricingPreview();

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
          <p>Start with a free member account to follow adult women creators. Choose and pay for memberships or content only when you want access; every tier should say exactly what it includes. Creator accounts are separate.</p>
        </div>
      </section>

      <section className="section-wrap plan-section" aria-labelledby="plan-heading">
        <div className="plan-section-heading">
          <p className="eyebrow">COMPARE ACCESS</p>
          <h2 id="plan-heading">Choose what works for you.</h2>
          <p>These are proposed VIXEN examples, shown per creator each month. The $3.99 entry is designed to keep the first paid step approachable. Creators set their own price and list the exact perks. Members are adults 18+; creator accounts are a separate path for adult women.</p>
          <Link className="vixen-discover-link" href="/sign-up?type=creator">Creator account information <span aria-hidden="true">→</span></Link>
        </div>

        <div className="member-plan-grid">
          {plans.map((plan) => (
            <article className={`member-plan-card${plan.id === "free" ? " member-plan-free" : ""}`} key={plan.id} aria-labelledby={`plan-${plan.id}`}>
              <header className="member-plan-header">
                <p className="member-plan-kind">{plan.id === "free" ? "MEMBER ACCOUNT" : "CREATOR MEMBERSHIP"}</p>
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

              {plan.id === "free" && <Link className="button member-plan-cta" href="/sign-up">Create a free account <span aria-hidden="true">↗</span></Link>}
            </article>
          ))}
        </div>
      </section>

      <section className="section-wrap cost-clarity" aria-labelledby="cost-clarity-title">
        <div className="cost-clarity-heading">
          <p className="eyebrow">WHO PAYS — AND WHEN?</p>
          <h2 id="cost-clarity-title">Members choose access.<br /><span>Creators shouldn’t pay to get started.</span></h2>
          <p>The prices above are examples of what a member might pay to subscribe to one creator. They are not creator signup fees.</p>
        </div>
        <div className="cost-clarity-grid">
          <article>
            <p className="cost-clarity-label">FOR MEMBERS · 18+</p>
            <h3>Browse free. Pay only for what you choose.</h3>
            <ul>
              <li>Creating a member account and browsing public creator profiles is free.</li>
              <li>Paid memberships are optional and apply to one creator at a time; the creator’s actual price and included access must be shown before payment.</li>
              <li>Paid messages, tips, individual posts, and store purchases are separate unless clearly listed as included.</li>
            </ul>
          </article>
          <article>
            <p className="cost-clarity-label">FOR CREATORS · ADULT WOMEN</p>
            <h3>No pay-to-join fee is planned.</h3>
            <ul>
              <li>The membership prices above are paid by members to access a creator’s offerings; creators do not buy those plans.</li>
              <li>Creators should be able to set up a creator account without paying upfront before they can earn.</li>
              <li>VIXEN’s commission, payout costs, and final creator terms have not been set. They must be disclosed before creator onboarding or monetization opens.</li>
            </ul>
          </article>
        </div>
        <p className="cost-clarity-notice"><strong>Still a preview:</strong> account signup, creator onboarding, subscriptions, payouts, and checkout are not active. No one can be charged through this page.</p>
      </section>

      <section className="section-wrap pricing-edge" aria-labelledby="pricing-edge-title">
        <div className="pricing-edge-heading">
          <p className="eyebrow">THE VIXEN DIFFERENCE</p>
          <h2 id="pricing-edge-title">Familiar creator access.<br /><span>Clearer value from the start.</span></h2>
          <p>OnlyFans is the baseline for familiar creator profiles, memberships, exclusive posts, paid messages, and tips. VIXEN is being designed to add a lower-cost entry example, plain-language access boundaries, and payment options planned with Caribbean members in mind.</p>
        </div>
        <div className="pricing-edge-grid">
          <article><span className="pricing-edge-number">01</span><h3>Start free</h3><p>Make a free member account and explore public profiles before choosing a paid creator membership.</p></article>
          <article><span className="pricing-edge-number">02</span><h3>Step in from $3.99</h3><p>Our proposed Bronze example is $3.99 per month for one creator. Prices shown are illustrative; creators choose their actual prices.</p></article>
          <article><span className="pricing-edge-number">03</span><h3>Know every boundary</h3><p>Each creator tier should show its price, included posts and drops, paid extras, renewal, and cancellation terms before checkout.</p></article>
          <article><span className="pricing-edge-number">04</span><h3>Plan for the Caribbean</h3><p>Card, bank transfer, WiPay, PayPal, Wise, and crypto are planned. Only payment options actually enabled for your location will appear at checkout.</p></article>
        </div>
        <p className="pricing-edge-note"><strong>Preview:</strong> VIXEN accounts, paid creator features, checkout, and payment methods are not active yet. These are product goals, not a claim that they are live.</p>
      </section>

      <section className="section-wrap nine-offer" aria-labelledby="nine-offer-title">
        <div className="nine-offer-mark" aria-hidden="true">NINE</div>
        <div className="nine-offer-copy">
          <p className="eyebrow">PLANNED PAYMENT BENEFIT</p>
          <h2 id="nine-offer-title">Pay with NINE. <span>Save 33⅓%.</span></h2>
          <p>When NINE Coin payments are supported, get 33⅓% off any VIXEN creator subscription paid with NINE.</p>
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
          <small>© {new Date().getFullYear()} VIXEN. Prices and packages shown are illustrative. <span className="company-name">Verified Interactive Xperience &amp; Entertainment Network</span></small>
        </div>
      </footer>
    </main>
  );
}
