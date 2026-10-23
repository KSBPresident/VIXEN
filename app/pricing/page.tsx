import Image from "next/image";
import { getMembershipPricingPreview } from "@/lib/application/pricing/get-membership-pricing-preview";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import "./pricing-upgrade.css";
import "./cost-clarity.css";

export const metadata = {
  title: "Free accounts and memberships",
  description: "Compare free VIXEN accounts with creator-specific membership access.",
};

export const dynamic = "force-dynamic";

export default async function PricingPage() {
  let isSignedIn = false;
  const supabaseConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY));
  if (supabaseConfigured) {
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();
      isSignedIn = Boolean(user);
    } catch {
      isSignedIn = false;
    }
  }
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
          <Link className="button button-small" href={isSignedIn ? "/account" : "/sign-up?type=member"}>{isSignedIn ? "My account" : "Join free"} <span aria-hidden="true">↗</span></Link>
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
              {plan.id !== "free" && <p className="member-plan-status" role="status"><strong>Coming soon</strong> · paid memberships are not available yet.</p>}

              <div className="member-plan-includes">
                <h4>Included</h4>
                <ul>{plan.included.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>

              <div className="member-plan-boundary">
                <h4>Not included</h4>
                <p>{plan.excluded}</p>
              </div>

              {plan.id === "free" ? (
                <Link className="button member-plan-cta" href={isSignedIn ? "/account" : "/sign-up?type=member"}>{isSignedIn ? "Open your account" : "Create a free account"} <span aria-hidden="true">↗</span></Link>
              ) : (
                <button className="button button-outline member-plan-cta" type="button" disabled>
                  Coming soon
                </button>
              )}
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
              <li>VIXEN’s planned standard platform commission is 15%; creators keep 85% before any separately disclosed processing fees, taxes, refunds, or chargebacks.</li>
              <li><strong>First official week discount · November 3–9, 2026:</strong> For this first official week only, VIXEN’s commission is discounted from 15% to 5%, so creators keep 95% before other applicable deductions. The standard 15% commission resumes November 10, 2026.</li>
            </ul>
          </article>
        </div>
        <p className="cost-clarity-notice"><strong>Account status:</strong> free email/password member accounts are live. Creator approval and publishing, subscriptions, paid content, and checkout are not active. Listed wallet routes allow manual proof submission and review; no one is charged through this pricing page.</p>
      </section>

      <section className="section-wrap pricing-edge" aria-labelledby="pricing-edge-title">
        <div className="pricing-edge-heading">
          <p className="eyebrow">THE VIXEN DIFFERENCE</p>
          <h2 id="pricing-edge-title">Familiar creator access.<br /><span>Clearer value from the start.</span></h2>
          <p>OnlyFans is the baseline for familiar creator profiles, memberships, exclusive posts, paid messages, and tips. VIXEN is being designed to add a lower-cost entry example, plain-language access boundaries, and payment options planned with Caribbean members in mind.</p>
        </div>
        <div className="pricing-edge-grid">
          <article><span className="pricing-edge-number">01</span><h3>Start free</h3><p>Make a free member account and explore public profiles before choosing a paid creator membership.</p></article>
          <article><span className="pricing-edge-number">02</span><p className="pricing-edge-status" role="status">Coming soon</p><h3>Step in from $3.99</h3><p>Our proposed Bronze example is $3.99 per month for one creator. Prices shown are illustrative; creators choose their actual prices.</p></article>
          <article><span className="pricing-edge-number">03</span><h3>Know every boundary</h3><p>Each creator tier should show its price, included posts and drops, paid extras, renewal, and cancellation terms before checkout.</p></article>
          <article><span className="pricing-edge-number">04</span><p className="pricing-edge-status" role="status">Coming soon</p><h3>Plan for the Caribbean</h3><p>Card, bank transfer, Wise, crypto, and Endcash QR for Trinidad and Tobago are planned. WiPay requires written merchant approval for VIXEN adult content and private-member events. PayPal is not supported for VIXEN adult digital content, subscriptions, or webcam/video-call services under its current policy.</p></article>
        </div>
        <p className="pricing-edge-note"><strong>Current status:</strong> free member accounts are live. Paid creator features and checkout remain previews. Listed crypto routes accept payment proof for manual review; they do not automatically unlock purchases.</p>
      </section>

      <section className="section-wrap nine-offer" aria-labelledby="vixen-coin-title">
        <div className="nine-offer-copy">
          <p className="eyebrow">TEMPORARY PLATFORM CREDIT · NOT A CRYPTO TOKEN</p>
          <h2 id="vixen-coin-title">VIXEN Coins <span>Coming soon.</span></h2>
          <p>Until the VIXEN and NINE crypto coins are finished, VIXEN Coins are planned as an internal account balance only. Planned value: 1 VIXEN Coin = $1 USD in VIXEN purchase credit. Members will be able to add balance using supported USDT or USDC, see it in their account wallet, and spend it on creator tips and listed creator offers. Only approved creators will be able to request payout of their creator earnings in USDT or USDC.</p>
          <p className="nine-offer-status"><strong>Coming soon · Not available now.</strong> No coin purchases, transfers, or creator payouts are enabled. VIXEN Coins are not the VIXEN or NINE blockchain tokens, cannot be transferred outside VIXEN, and will have no payment discount. Wallet funding, payment verification, creator settlement, and payout controls must be completed before launch.</p>
        </div>
      </section>

      <section className="section-wrap nine-offer" aria-labelledby="nine-offer-title">
        <div className="nine-offer-mark" aria-hidden="true">NINE</div>
        <div className="nine-offer-copy">
          <p className="eyebrow">COMING SOON · PAYMENT BENEFIT</p>
          <h2 id="nine-offer-title">Pay with NINE. <span>Save 10%.</span></h2>
          <p>When NINE Coin payments are supported, get 10% off a VIXEN creator subscription paid with NINE. Paying with other cryptocurrencies will not receive a discount.</p>
          <p className="nine-offer-status"><strong>Coming soon · Not available today.</strong> VIXEN does not currently accept NINE Coin. Supported networks, payment verification, and purchase sources will be confirmed before launch.</p>
        </div>
      </section>

      <section className="section-wrap payment-methods" aria-labelledby="payment-methods-title">
        <div>
          <p className="eyebrow">PAYMENT AVAILABILITY</p>
          <h2 id="payment-methods-title">Wallet payments with manual review.</h2>
          <p>VIXEN currently accepts payment proof for selected USDT, USDC, and TRX wallet routes. Get an exact total and order reference from VIXEN before sending funds, then submit your transaction ID and screenshot for admin review.</p>
        </div>
        <ul className="payment-method-list" aria-label="Payment method availability">
          <li><strong>Available · manual review:</strong> USDT on Tron, Solana, BNB Smart Chain, Polygon, and Ethereum.</li>
          <li><strong>Available · manual review:</strong> USDC on Solana, BNB Smart Chain, Polygon, and Ethereum.</li>
          <li><strong>Available · manual review:</strong> TRX on Tron.</li>
          <li><strong>Coming soon:</strong> BNB, SOL, ETH, MATIC, card payments, bank transfer, Wise, WiPay, and Endcash order checkout.</li>
          <li><strong>Not offered:</strong> PayPal for VIXEN adult digital content, subscriptions, or webcam/video-call services.</li>
        </ul>
        <p className="payment-method-note">A screenshot is not proof of settlement. VIXEN independently checks the transaction before manually reviewing the payment. Proof approval does not automatically unlock a subscription, creator content, or store order; those fulfillment flows are not active. Do not send funds until VIXEN confirms the amount, asset, network, and order reference. Never share wallet passwords, recovery phrases, or private keys.</p>
        <p className="center-action"><Link className="button button-outline" href="/crypto-payments">View wallet routes</Link> <Link className="button" href="/crypto-payments/proof">Submit payment proof</Link></p>
      </section>

      <section className="section-wrap plan-section private-club-section" aria-labelledby="private-club-heading">
        <div className="plan-section-heading">
          <p className="eyebrow">PRIVATE MEMBER EXPERIENCE · 21+</p>
          <h2 id="private-club-heading">A more personal VIXEN experience.</h2>
          <p>VIXEN is planning a private, members-only social experience where eligible members may meet participating creators at scheduled events. Entry is for members aged 21 and over, with age verification required. Active VIP or VVIP membership card must be presented at check-in; no card means no entry. The experience is separate from creator subscriptions and online content. Membership access does not guarantee an event booking, a meeting with a specific creator, or any personal interaction.</p>
        </div>
<div className="private-events-preview-link"><Link className="vixen-discover-link" href="/events">Open the private experiences preview <span aria-hidden="true">→</span></Link></div>
                <div className="member-plan-grid">
          <article className="member-plan-card member-plan-free" aria-labelledby="private-standard">
            <header className="member-plan-header">
              <p className="member-plan-kind">PLATFORM MEMBERSHIP</p>
              <h3 id="private-standard">Standard</h3>
              <p>Join VIXEN and explore public creator profiles and previews.</p>
              <p className="member-plan-price"><strong>Free</strong><span>account</span></p>
            </header>
            <div className="member-plan-includes">
              <h4>Included</h4>
              <ul><li>Free member account</li><li>Public creator profiles and previews</li><li>Choose online memberships separately</li></ul>
            </div>
            <div className="member-plan-boundary">
              <h4>Private events</h4>
              <p>Does not include eligibility for private member events.</p>
            </div>
          </article>
          <article className="member-plan-card" aria-labelledby="private-vip">
            <header className="member-plan-header">
              <p className="member-plan-kind">PRIVATE MEMBERSHIP · COMING SOON</p>
              <h3 id="private-vip">VIP</h3>
              <p>A planned membership level for eligible private VIXEN events.</p>
              <p className="member-plan-price"><strong>Coming soon</strong><span>price not set</span></p>
            </header>
            <div className="member-plan-includes">
              <h4>Planned access</h4>
              <ul><li>Members must be 21 or older and pass age verification</li><li>Present an active VIP membership card at check-in; no card means no entry</li><li>Eligibility to request entry to designated events</li><li>Event details, capacity, and any ticket price shown in advance</li><li>Participation by creators is opt-in for each event</li></ul>
            </div>
            <div className="member-plan-boundary">
              <h4>Access boundaries</h4>
              <p>Membership does not guarantee admission, creator availability, or personal interaction. Event-specific rules apply.</p>
            </div>
          </article>
          <article className="member-plan-card" aria-labelledby="private-vvip">
            <header className="member-plan-header">
              <p className="member-plan-kind">PRIVATE MEMBERSHIP · COMING SOON</p>
              <h3 id="private-vvip">VVIP</h3>
              <p>A higher private membership level; final benefits are still being defined.</p>
              <p className="member-plan-price"><strong>Coming soon</strong><span>price not set</span></p>
            </header>
            <div className="member-plan-includes">
              <h4>Before enrollment</h4>
              <ul><li>Members must be 21 or older and pass age verification</li><li>Present an active VVIP membership card at check-in; no card means no entry</li><li>Redeem a VVIP ID from a signed-in account to unlock complimentary Elite membership status across VIXEN</li><li>VVIP ID is verified before status is applied; it can’t be reused across accounts</li><li>Event capacity, booking terms, and any additional charges will be disclosed</li><li>Creators choose whether to attend each event</li></ul>
            </div>
            <div className="member-plan-boundary">
              <h4>Consent and safety</h4>
              <p>Everyone attending must be 21+ and follow event consent, privacy, and safety rules. Membership never implies consent to contact or physical interaction.</p>
            </div>
          </article>
        </div>
        <p className="cost-clarity-notice"><strong>Planned, not active:</strong> VVIP members will be able to enter their ID while signed in; after server-side verification, VIXEN will apply complimentary Elite membership status to that account. IDs must be securely issued, verified, and protected against reuse. The redemption flow, physical or digital card issuance, private experience, VIP/VVIP enrollment, age verification, event booking, and entry controls are not live. Final prices, benefits, eligibility, location, and operating rules must be published before launch.</p>
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
        <p className="pricing-preview-notice"><strong>Preview only:</strong> these prices and tiers describe the planned package structure. Account registration is available, but checkout, recurring billing, and paid tier access are not active. No payment is taken from this page.</p>
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
